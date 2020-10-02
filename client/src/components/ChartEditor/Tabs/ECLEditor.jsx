import React, { useCallback, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { ECLEditor } from '@hpcc-js/codemirror';
import { Topology, Workunit } from '@hpcc-js/comms';
import { Button, SelectDropDown, Spacer, TitleBar } from '@hpcc-js/common';
import { Border2 } from '@hpcc-js/layout';
import { SplitPanel } from '@hpcc-js/phosphor';
import { debounce } from 'lodash';

// Utils
import { getECLParams } from '../../../utils/cluster';

const useStyles = makeStyles(theme => ({
  eclWidgetStyle: { margin: theme.spacing(2.5, 0), minHeight: 300 },
}));

const ECLEditorComp = ({ clusterID, clusterURL, eclRef }) => {
  const { cluster, script } = eclRef.current;
  const editor = new ECLEditor();
  const titleBar = new TitleBar();
  const clusterDropdown = new SelectDropDown();
  const runButton = new Button();
  const mainSection = new SplitPanel('vertical');
  const layout = new Border2();
  const runBtnClasses = { ready: 'play_circle_outline', working: 'hourglass_empty' };
  const targetCluster = useRef(null);
  const playButtonElement = useRef(null);
  const clusterIndex = useRef(0);
  const targetDomId = 'ecleditor';

  const { eclWidgetStyle } = useStyles();
  let workunit;

  const displayWorkunitID = useCallback(
    workunitID => {
      const link = document.createElement('a');
      link.href = `${clusterURL}?Wuid=${workunitID}&Widget=WUDetailsWidget`;
      link.target = '_blank';
      link.innerText = workunitID;

      const _title = document.querySelector(`#ecleditor header .title-text`);
      _title.innerHTML = '';
      _title.appendChild(link);
    },
    [clusterURL],
  );

  const resetPlayButton = useCallback(() => {
    playButtonElement.current.classList.remove(runBtnClasses.working);
    playButtonElement.current.classList.add(runBtnClasses.ready);
    playButtonElement.current.innerText = runBtnClasses.ready;
    playButtonElement.current.setAttribute('title', 'Submit');
    runButton.disabled = false;
  }, [runBtnClasses, runButton]);

  const displayErrors = useCallback(() => {
    workunit.fetchECLExceptions().then(errors => {
      const { _espState, ErrorCount = 0 } = workunit;

      if (ErrorCount > 0) {
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

        displayWorkunitID(_espState.Wuid);
        resetPlayButton();
      }
    });
  }, [displayWorkunitID, editor, resetPlayButton, workunit]);

  const getResults = useCallback(() => {
    return workunit.fetchResults().then(() => {
      const { CResults = 0 } = workunit;
      const outputCount = CResults.length > 0 ? CResults.length : 1;
      const _result = CResults[outputCount - 1];

      _result.fetchRows().then(async response => {
        const { Count, ECLSchemas, ResultName, Wuid } = _result._espState;
        const params = await getECLParams(clusterID, Wuid);

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

        displayWorkunitID(Wuid);
        resetPlayButton();
      });
    });
  }, [clusterID, displayWorkunitID, eclRef, editor, resetPlayButton, workunit]);

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
      eclRef.current.workunitID = workunit._espState.Wuid;
    }

    editor.removeAllHighlight();

    if (workunit.isFailed()) {
      displayErrors();
    } else {
      getResults();
    }
  });

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

      editor._codemirror.doc.on(
        'change',
        debounce(() => {
          eclRef.current.script = editor.ecl();
        }, 500),
      );

      if (eclRef.current.workunitID) {
        displayWorkunitID(eclRef.current.workunitID);
      }

      window.clearTimeout(t);
    }, 300);

    const _dropdown = document.querySelector(`#${clusterDropdown._id}`);
    const lbl = document.createElement('label');

    // Set _dropdown initial selection
    _dropdown.selectedIndex = clusterIndex.current;

    lbl.innerText = 'Target:';
    lbl.setAttribute('style', 'margin-right: 6px;');
    _dropdown.parentElement.insertBefore(lbl, _dropdown);
  }, [
    clusterDropdown,
    displayWorkunitID,
    eclRef,
    editor,
    layout,
    mainSection,
    runBtnClasses,
    runButton,
    targetDomId,
    titleBar,
  ]);

  useEffect(() => {
    if (clusterURL === '') {
      console.error('ECLWidget Error: Provide a valid "clusterURL" in the options object');
      return;
    }

    if (script && script !== '') {
      editor.ecl(script);
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

      clusterIndex.current = cluster ? Object.keys(_clusters).indexOf(cluster) : 0;
      clusterIndex.current = clusterIndex.current === -1 ? 0 : clusterIndex.current;

      targetCluster.current = Object.keys(_clusters)[clusterIndex.current];

      addComponentsToWidget();
    })();
  }, [addComponentsToWidget, cluster, clusterDropdown, clusterURL, editor, script]);

  return <div id={targetDomId} className={eclWidgetStyle}></div>;
};

export default ECLEditorComp;
