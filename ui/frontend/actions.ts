import { ThunkAction as ReduxThunkAction, UnknownAction } from '@reduxjs/toolkit';

import { State } from './reducers';
import { editCode } from './reducers/code';
import {
  changeBacktrace,
  changeChannel,
  changeEditionRaw,
  changeMode,
  changePrimaryAction,
} from './reducers/configuration';
import { performCompileToAssemblyOnly } from './reducers/output/assembly';
import { performCommonExecute } from './reducers/output/execute';
import { performGistLoad } from './reducers/output/gist';
import { performCompileToLlvmIrOnly } from './reducers/output/llvmIr';
import { navigateToHelp, navigateToIndex } from './reducers/page';
import { getCrateType } from './selectors';
import {
  Backtrace,
  Channel,
  Edition,
  Mode,
  PrimaryAction,
  PrimaryActionAuto,
  PrimaryActionCore,
  parseChannel,
  parseEdition,
  parseMode,
} from './types';

export type ThunkAction<T = void> = ReduxThunkAction<T, State, unknown, UnknownAction>;

export const reExecuteWithBacktrace = (): ThunkAction => (dispatch) => {
  dispatch(changeBacktrace(Backtrace.Enabled));
  dispatch(performExecuteOnly());
};

function performAutoOnly(): ThunkAction {
  return function (dispatch, getState) {
    const state = getState();
    const crateType = getCrateType(state);

    return dispatch(performCommonExecute(crateType, false));
  };
}

const performExecuteOnly = (): ThunkAction => performCommonExecute('bin', false);
const performCompileOnly = (): ThunkAction => performCommonExecute('lib', false);

const PRIMARY_ACTIONS: { [index in PrimaryAction]: () => ThunkAction } = {
  [PrimaryActionCore.Asm]: performCompileToAssemblyOnly,
  [PrimaryActionCore.Compile]: performCompileOnly,
  [PrimaryActionCore.Execute]: performExecuteOnly,
  [PrimaryActionAuto.Auto]: performAutoOnly,
  [PrimaryActionCore.LlvmIr]: performCompileToLlvmIrOnly,
};

export const performPrimaryAction = (): ThunkAction => (dispatch, getState) => {
  const state = getState();
  const primaryAction = PRIMARY_ACTIONS[state.configuration.primaryAction];
  dispatch(primaryAction());
};

const performAndSwitchPrimaryAction =
  (inner: () => ThunkAction, id: PrimaryAction) => (): ThunkAction => (dispatch) => {
    dispatch(changePrimaryAction(id));
    dispatch(inner());
  };

export const performExecute = performAndSwitchPrimaryAction(
  performExecuteOnly,
  PrimaryActionCore.Execute,
);
export const performCompile = performAndSwitchPrimaryAction(
  performCompileOnly,
  PrimaryActionCore.Compile,
);
export const performCompileToAssembly = performAndSwitchPrimaryAction(
  performCompileToAssemblyOnly,
  PrimaryActionCore.Asm,
);
export const performCompileToLLVM = performAndSwitchPrimaryAction(
  performCompileToLlvmIrOnly,
  PrimaryActionCore.LlvmIr,
);

export function indexPageLoad({
  code,
  gist,
  version,
  mode: modeString,
  edition: editionString,
}: {
  code?: string;
  gist?: string;
  version?: string;
  mode?: string;
  edition?: string;
}): ThunkAction {
  return function (dispatch) {
    const channel = parseChannel(version) || Channel.Stable;
    const mode = parseMode(modeString) || Mode.Debug;
    let maybeEdition = parseEdition(editionString);

    dispatch(navigateToIndex());

    if (code || gist) {
      // We need to ensure that any links that predate the existence
      // of editions will *forever* pick 2015. However, if we aren't
      // loading code, then allow the edition to remain the default.
      if (!maybeEdition) {
        maybeEdition = Edition.Rust2015;
      }
    }

    const edition = maybeEdition || Edition.Rust2021;

    if (code) {
      dispatch(editCode(code));
    } else if (gist) {
      dispatch(performGistLoad({ id: gist, channel, mode, edition }));
    }

    dispatch(changeChannel(channel));
    dispatch(changeMode(mode));
    dispatch(changeEditionRaw(edition));
  };
}

export const helpPageLoad = navigateToHelp;

export function showExample(code: string): ThunkAction {
  return function (dispatch) {
    dispatch(navigateToIndex());
    dispatch(editCode(code));
  };
}
