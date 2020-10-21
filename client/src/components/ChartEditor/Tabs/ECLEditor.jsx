import React, { Fragment, useCallback, useEffect, useRef } from 'react';
import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { ECLEditor } from '@hpcc-js/codemirror';
import { Button, SelectDropDown, Spacer, TitleBar } from '@hpcc-js/common';
import { Border2 } from '@hpcc-js/layout';
import { SplitPanel } from '@hpcc-js/phosphor';
import { debounce } from 'lodash';

// Utils
import { getECLParams, getTargetClusters, submitWorkunit } from '../../../utils/cluster';

const useStyles = makeStyles(theme => ({
  eclWidgetStyle: { margin: theme.spacing(2.5, 0), minHeight: 300 },
  errorText: { color: theme.palette.error.dark },
}));

const ECLEditorComp = ({ clusterID, clusterURL, eclRef, handleChange, localState }) => {
  const { cluster, script } = eclRef.current;
  const editor = new ECLEditor();
  const titleBar = new TitleBar();
  const clusterDropdown = new SelectDropDown();
  const runButton = new Button();
  const mainSection = new SplitPanel('vertical');
  const layout = new Border2();
  const runBtnClasses = { ready: 'play_circle_outline', working: 'hourglass_empty' };
  const targetCluster = useRef(null);
  const { errors = [] } = localState;
  const playButtonElement = useRef(null);
  const clusterIndex = useRef(0);
  const targetDomId = 'ecleditor';

  const { eclWidgetStyle, errorText } = useStyles();

  const displayWorkunitID = useCallback(
    workunitID => {
      const link = document.createElement('a');
      link.href = `${clusterURL}?Wuid=${workunitID}&Widget=WUDetailsWidget`;
      link.target = '_blank';
      link.innerText = workunitID;

      const _title = document.querySelector(`#ecleditor header .title-text`);

      // Confirm element exists in DOM before modifying
      if (_title) {
        _title.innerHTML = '';
        _title.appendChild(link);
      }
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

  const displayErrors = useCallback(
    (errors, workunit) => {
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

      displayWorkunitID(workunit._espState.Wuid);
      resetPlayButton();
    },
    [displayWorkunitID, editor, resetPlayButton],
  );

  const getResults = useCallback(
    async (data, result) => {
      const { Count, ECLSchemas, ResultName, Wuid } = result._espState;
      const params = await getECLParams(clusterID, Wuid);

      // Get script schema and format
      const schema = ECLSchemas.ECLSchemaItem.map(({ ColumnName, ColumnType }) => ({
        name: ColumnName,
        type: ColumnType,
      }));

      // Create config object
      const eclConfig = {
        cluster: targetCluster.current,
        data: { [ResultName]: { Row: data } },
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
    },
    [clusterID, displayWorkunitID, eclRef, editor, resetPlayButton],
  );

  runButton.faChar(runBtnClasses.ready).tooltip('Submit');

  runButton.on('click', async () => {
    if (runButton.disabled) return;

    runButton.disabled = true;
    playButtonElement.current.innerText = runBtnClasses.working;
    playButtonElement.current.classList.remove(runBtnClasses.ready);
    playButtonElement.current.classList.add(runBtnClasses.working);
    playButtonElement.current.setAttribute('title', 'Working...');

    let workunitObj;

    try {
      // Submit ECL Script to cluster
      workunitObj = await submitWorkunit(clusterID, targetCluster.current, editor.ecl());
    } catch (err) {
      console.error(err);
      return resetPlayButton();
    }

    // Destructure response
    const { data, errors, result, workunit } = workunitObj;

    if (workunit && workunit._espState.Wuid) {
      eclRef.current.workunitID = workunit._espState.Wuid;
    }

    editor.removeAllHighlight();

    if (errors.length > 0) {
      handleChange(null, { name: 'errors', value: errors });
      displayErrors(errors, workunit);
    } else {
      handleChange(null, { name: 'errors', value: [] });
      getResults(data, result);
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

    const header = document.querySelector(`#${targetDomId} header`);

    // Confirm element exists in DOM before modifying
    if (header) {
      header.setAttribute('style', 'margin: 0 0 5px 0;');
    }

    let t = window.setTimeout(() => {
      playButtonElement.current = document.querySelector(`#${targetDomId} header .${runBtnClasses.ready}`);

      // Confirm element exists in DOM before modifying
      if (playButtonElement.current) {
        playButtonElement.current.setAttribute('style', 'margin-top: 2px;');
        playButtonElement.current.innerText = runBtnClasses.ready;
        playButtonElement.current.className += ' material-icons';
      }

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
    lbl.innerText = 'Target:';
    lbl.setAttribute('style', 'margin-right: 6px;');

    // Confirm element exists in DOM before modifying
    if (_dropdown) {
      _dropdown.setAttribute('style', 'margin-right: 4px;');
      _dropdown.selectedIndex = clusterIndex.current;
      _dropdown.parentElement.insertBefore(lbl, _dropdown);
    }
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

    // Script already defined, update editor
    if (script && script !== '') {
      editor.ecl(script);
    }

    (async () => {
      let clusters = [];
      let _clusters = {};

      try {
        // Get available target clusters
        clusters = await getTargetClusters(clusterID);
      } catch (err) {
        console.error(err);
        return;
      }

      // Populate _clusters object with cluster names
      clusters.forEach(({ _espState: { Name } }) => (_clusters[Name] = Name));

      // Add click handlers to dropdown for available cluster names
      clusterDropdown.values(_clusters).on('click', key => (targetCluster.current = key));

      clusterIndex.current = cluster ? Object.keys(_clusters).indexOf(cluster) : 0;
      clusterIndex.current = clusterIndex.current === -1 ? 0 : clusterIndex.current;

      targetCluster.current = Object.keys(_clusters)[clusterIndex.current];

      addComponentsToWidget();
    })();
  }, []);

  const eclRefErr = errors.find(err => err['eclRef']);
  const msgErr = errors.find(err => err['Message']);

  return (
    <Fragment>
      <div id={targetDomId} className={eclWidgetStyle}></div>
      {eclRefErr !== undefined && (
        <FormHelperText className={errorText}>{eclRefErr['eclRef']}</FormHelperText>
      )}
      {msgErr !== undefined && <FormHelperText className={errorText}>{msgErr['Message']}</FormHelperText>}
    </Fragment>
  );
};

export default ECLEditorComp;
