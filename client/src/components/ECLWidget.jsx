import React, { Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { ECLEditor } from '@hpcc-js/codemirror';
import { Topology, Workunit } from '@hpcc-js/comms';
import { Button, SelectDropDown, Spacer, TitleBar } from '@hpcc-js/common';
import { Table } from '@hpcc-js/dgrid';
import { Border2 } from '@hpcc-js/layout';
import { SplitPanel, TabPanel } from '@hpcc-js/phosphor';

const useStyles = makeStyles({
  eclWidgetStyle: { margin: 20, minHeight: 300 },
});

const ECLWidget = ({
  targetDomId,
  clusterUrl = '',
  initialCode = '',
  showLinkToECLWatch = false,
  showResults = false,
  deleteWuAfterRun = false,
}) => {
  const { eclWidgetStyle } = useStyles();

  let editor = new ECLEditor(),
    workunit = null,
    targetCluster = null,
    titleBar = new TitleBar(),
    runButton = new Button(),
    playButtonElement = null,
    clusterDropdown = new SelectDropDown(),
    wuResults = new TabPanel(),
    mainSection = new SplitPanel('vertical'),
    layout = new Border2(),
    tables = [],
    resultsShown = false,
    runBtnClasses = {
      ready: 'play_circle_outline',
      working: 'hourglass_empty',
    };

  let displayErrors = () => {
    tables.forEach(t => wuResults.removeWidget(t));
    let table = new Table();
    workunit.fetchECLExceptions().then(errors => {
      if (workunit.ErrorCount > 0) {
        let rows = [];
        errors.forEach(err => {
          rows.push([err.Severity, err.LineNo, err.Message]);
          let start = 0,
            end = editor._codemirror.doc.getLine(err.LineNo - 1).length;
          for (var i = 0; i < err.LineNo - 1; i++) {
            start += editor._codemirror.doc.getLine(i).length + 1;
          }
          editor.highlightError(start, start + end);
        });
        table
          .columns(['Severity', 'Line No', 'Message'])
          .data(rows)
          .lazyRender();

        tables.push(table);
        wuResults.addWidget(table, 'Errors');
        if (!resultsShown) {
          mainSection.addWidget(wuResults);
          resultsShown = true;
        }
      }

      if (deleteWuAfterRun) {
        workunit.delete();
      }
    });
  };

  let displayResults = () => {
    tables.forEach(t => wuResults.removeWidget(t));
    tables = [];
    return workunit.fetchResults().then(() => {
      workunit.CResults.forEach(_result => {
        let table = new Table();
        tables.push(table);
        _result.fetchRows().then(response => {
          let rows = [];
          response.forEach(row => {
            rows.push(Object.values(row));
          });
          table
            .columns(Object.keys(response[0]))
            .data(rows)
            .lazyRender();
        });
        wuResults.addWidget(table, _result._espState.Name);
      });

      if (showResults) {
        if (!resultsShown) {
          mainSection.addWidget(wuResults);
          resultsShown = true;
        }
      }

      if (deleteWuAfterRun) {
        workunit.delete();
      }
    });
  };

  if (initialCode !== '') {
    editor.ecl(initialCode);
  }

  runButton.faChar(runBtnClasses.ready).tooltip('Submit');

  runButton.on('click', () => {
    if (runButton.disabled) return;

    runButton.disabled = true;
    playButtonElement.innerText = runBtnClasses.working;
    playButtonElement.classList.remove(runBtnClasses.ready);
    playButtonElement.classList.add(runBtnClasses.working);
    playButtonElement.setAttribute('title', 'Working...');

    Workunit.submit({ baseUrl: clusterUrl }, targetCluster, editor.ecl())
      .then(wu => {
        workunit = wu;
        return workunit.watchUntilComplete();
      })
      .then(() => {
        if (workunit && workunit._espState.Wuid) {
          let _title = document.querySelector('#' + targetDomId + ' header .title-text');
          _title.innerHTML = '';

          if (showLinkToECLWatch) {
            let link = document.createElement('a');
            link.href = clusterUrl + '?Wuid=' + workunit._espState.Wuid + '&Widget=WUDetailsWidget';
            link.target = '_blank';
            link.innerText = workunit._espState.Wuid;
            _title.appendChild(link);
          } else {
            _title.innerText = workunit._espState.Wuid;
          }

          if (deleteWuAfterRun) {
            let deleteNote = document.createElement('small');
            deleteNote.innerText = '(deleted)';
            deleteNote.setAttribute(
              'style',
              'font-size: 11px; position: absolute; margin: 5px 10px; font-weight: normal;',
            );
            _title.appendChild(deleteNote);
          }
        }

        playButtonElement.classList.remove(runBtnClasses.working);
        playButtonElement.classList.add(runBtnClasses.ready);
        playButtonElement.innerText = runBtnClasses.ready;
        playButtonElement.setAttribute('title', 'Submit');
        runButton.disabled = false;

        editor.removeAllHighlight();

        if (workunit.isFailed()) {
          displayErrors();
        } else {
          // WU did not fail
          if (showResults) {
            displayResults();
          } else {
            if (deleteWuAfterRun) {
              workunit.delete();
            }
          }
        } //end if WU is not failed
      }); //end .then() of Workunit.submit(...)
  }); //end click callback for runButton

  let addComponentsToWidget = () => {
    mainSection.addWidget(editor);

    titleBar.buttons([clusterDropdown, new Spacer(), runButton]);

    layout
      .top(titleBar)
      .center(mainSection)
      .target(targetDomId)
      .render();

    document.querySelector('#' + targetDomId + ' header').style.margin = '0 0 5px 0';

    let t = window.setTimeout(() => {
      playButtonElement = document.querySelector('#' + targetDomId + ' header .' + runBtnClasses.ready);
      playButtonElement.style['margin-top'] = '2px';
      playButtonElement.innerText = runBtnClasses.ready;
      playButtonElement.className += ' material-icons';
      window.clearTimeout(t);
    }, 100);

    let _dropdown = document.querySelector('#' + clusterDropdown._id),
      lbl = document.createElement('label');

    lbl.innerText = 'Target:';
    lbl.setAttribute('style', 'margin-right: 6px;');
    _dropdown.parentElement.insertBefore(lbl, _dropdown);
  };

  useEffect(() => {
    if (clusterUrl === '') {
      console.error('ECLWidget Error: Provide a valid "clusterUrl" in the options object');
      return;
    }

    let topology = new Topology({
      baseUrl: clusterUrl,
    });

    topology.fetchTargetClusters().then(clusters => {
      let _clusters = {};
      clusters.forEach(c => {
        _clusters[c._espState.Name] = c._espState.Name;
      });

      clusterDropdown.values(_clusters).on('click', key => {
        targetCluster = key;
      });

      targetCluster = Object.keys(_clusters)[0];

      addComponentsToWidget();
    });
  }, []);

  return (
    <Fragment>
      <div id={targetDomId} className={eclWidgetStyle}></div>
    </Fragment>
  );
};

export default ECLWidget;
