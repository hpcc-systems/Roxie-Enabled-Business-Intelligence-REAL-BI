import React, { useCallback, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { ECLEditor } from '@hpcc-js/codemirror';
import { Topology, Workunit } from '@hpcc-js/comms';
import { Button, SelectDropDown, Spacer, TitleBar } from '@hpcc-js/common';
import { Border2 } from '@hpcc-js/layout';
import { SplitPanel, TabPanel } from '@hpcc-js/phosphor';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  eclWidgetStyle: { margin: theme.spacing(2.5, 0), minHeight: 300 },
}));

const ECLEditorComp = ({ clusterURL, eclRef }) => {
  const { script } = eclRef.current;

  const editor = new ECLEditor();
  const titleBar = new TitleBar();
  const clusterDropdown = new SelectDropDown();
  const runButton = new Button();
  const wuResults = new TabPanel();
  const mainSection = new SplitPanel('vertical');
  const layout = new Border2();
  const runBtnClasses = { ready: 'play_circle_outline', working: 'hourglass_empty' };
  const targetCluster = useRef(null);
  const playButtonElement = useRef(null);
  const resultsShown = useRef(false);
  const showLinkToECLWatch = true;
  const showResults = true;
  const deleteWuAfterRun = false;
  const targetDomId = 'ecleditor';

  const { eclWidgetStyle } = useStyles();

  let workunit;

  if (script && script !== '') {
    editor.ecl(script);
  }

  const displayErrors = useCallback(() => {
    workunit.fetchECLExceptions().then(errors => {
      if (workunit.ErrorCount > 0) {
        errors.forEach(({ LineNo }) => {
          const lineError = LineNo;
          const lineErrorNum = lineError > 0 ? lineError - 1 : 0;

          let start = 0;
          const end = editor._codemirror.doc.getLine(lineErrorNum).length;

          for (var i = 0; i < lineErrorNum; i++) {
            start += editor._codemirror.doc.getLine(i).length + 1;
          }

          editor.highlightError(start, start + end);
        });

        if (!resultsShown) {
          mainSection.addWidget(wuResults);
          resultsShown.current = true;
        }
      }

      if (deleteWuAfterRun) {
        workunit.delete();
      }
    });
  }, [deleteWuAfterRun, editor, mainSection, workunit, wuResults]);

  const getResults = useCallback(() => {
    return workunit.fetchResults().then(() => {
      const outputCount = workunit.CResults.length > 0 ? workunit.CResults.length : 1;
      const _result = workunit.CResults[outputCount - 1];

      _result.fetchRows().then(async response => {
        const { Count, ECLSchemas, ResultName, Wuid } = _result._espState;
        const url = `${clusterURL}/WsWorkunits/WUInfo.json`;

        // Make call to get info for variables defined in ecl script
        const paramsResp = await axios.post(url, { WUInfoRequest: { Wuid } });
        let params = [];

        // If there is a data object
        if (paramsResp.data) {
          paramsResp.data.WUInfoResponse.Workunit.Variables.ECLResult.forEach(({ Name }) => {
            params.push({ name: Name, type: '', value: null });
          });
        }

        // Get script schema and format
        const schema = ECLSchemas.ECLSchemaItem.map(({ ColumnName, ColumnType }) => ({
          name: ColumnName,
          type: ColumnType,
        }));

        // Create config object
        const eclConfig = {
          cluster: targetCluster.current,
          data: { [ResultName]: { Row: response } },
          dataset: ResultName,
          params,
          recordCount: Count,
          schema,
          script: editor.ecl(),
          workunitID: Wuid,
        };

        // Update ref
        eclRef.current = eclConfig;
      });

      if (showResults) {
        if (!resultsShown) {
          mainSection.addWidget(wuResults);
          resultsShown.current = true;
        }
      }

      if (deleteWuAfterRun) {
        workunit.delete();
      }
    });
  }, [clusterURL, deleteWuAfterRun, eclRef, editor, mainSection, showResults, workunit, wuResults]);

  runButton.faChar(runBtnClasses.ready).tooltip('Submit');

  runButton.on('click', async () => {
    if (runButton.disabled) return;

    runButton.disabled = true;
    playButtonElement.current.innerText = runBtnClasses.working;
    playButtonElement.current.classList.remove(runBtnClasses.ready);
    playButtonElement.current.classList.add(runBtnClasses.working);
    playButtonElement.current.setAttribute('title', 'Working...');

    // Submit ECL Script to cluster
    workunit = await Workunit.submit({ baseUrl: clusterURL }, targetCluster.current, editor.ecl());

    // Watch workunit until it completes
    await workunit.watchUntilComplete();

    if (workunit && workunit._espState.Wuid) {
      const _title = document.querySelector(`#${targetDomId} header .title-text`);
      _title.innerHTML = '';

      if (showLinkToECLWatch) {
        const link = document.createElement('a');
        link.href = `${clusterURL}?Wuid=${workunit._espState.Wuid}&Widget=WUDetailsWidget`;
        link.target = '_blank';
        link.innerText = workunit._espState.Wuid;
        _title.appendChild(link);
      } else {
        _title.innerText = workunit._espState.Wuid;
      }

      if (deleteWuAfterRun) {
        const deleteNote = document.createElement('small');
        deleteNote.innerText = '(deleted)';
        deleteNote.setAttribute(
          'style',
          'font-size: 11px; position: absolute; margin: 5px 10px; font-weight: normal;',
        );
        _title.appendChild(deleteNote);
      }
    }

    playButtonElement.current.classList.remove(runBtnClasses.working);
    playButtonElement.current.classList.add(runBtnClasses.ready);
    playButtonElement.current.innerText = runBtnClasses.ready;
    playButtonElement.current.setAttribute('title', 'Submit');
    runButton.disabled = false;

    editor.removeAllHighlight();

    if (workunit.isFailed()) {
      displayErrors();
    } else {
      // WU did not fail
      if (showResults) {
        getResults();
      } else {
        if (deleteWuAfterRun) {
          workunit.delete();
        }
      }
    } //end if WU is not failed
  }); //end click callback for runButton

  const addComponentsToWidget = useCallback(() => {
    mainSection.addWidget(editor);

    titleBar.buttons([clusterDropdown, new Spacer(), runButton]);

    layout
      .top(titleBar)
      .center(mainSection)
      .target(targetDomId)
      .render();

    document.querySelector(`#${targetDomId} header`).style.margin = '0 0 5px 0';

    let t = window.setTimeout(() => {
      playButtonElement.current = document.querySelector(`#${targetDomId} header .${runBtnClasses.ready}`);
      playButtonElement.current.style['margin-top'] = '2px';
      playButtonElement.current.innerText = runBtnClasses.ready;
      playButtonElement.current.className += ' material-icons';
      window.clearTimeout(t);
    }, 100);

    const _dropdown = document.querySelector(`#${clusterDropdown._id}`);
    const lbl = document.createElement('label');

    lbl.innerText = 'Target:';
    lbl.setAttribute('style', 'margin-right: 6px;');
    _dropdown.parentElement.insertBefore(lbl, _dropdown);
  }, [clusterDropdown, editor, layout, mainSection, runBtnClasses.ready, runButton, targetDomId, titleBar]);

  useEffect(() => {
    if (clusterURL === '') {
      console.error('ECLWidget Error: Provide a valid "clusterURL" in the options object');
      return;
    }

    (async () => {
      const topology = new Topology({ baseUrl: clusterURL });
      let _clusters = {};

      // Get available target clusters
      const clusters = await topology.fetchTargetClusters();

      // Populate _clusters object with cluster names
      clusters.forEach(({ _espState: { Name } }) => (_clusters[Name] = Name));

      // Add click handlers to dropdown for available cluster names
      clusterDropdown.values(_clusters).on('click', key => (targetCluster.current = key));

      targetCluster.current = Object.keys(_clusters)[0];

      addComponentsToWidget();
    })();
  }, [addComponentsToWidget, clusterDropdown, clusterURL]);

  return <div id={targetDomId} className={eclWidgetStyle}></div>;
};

export default ECLEditorComp;
