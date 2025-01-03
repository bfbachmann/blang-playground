/* global ACE_KEYBINDINGS:false, ACE_THEMES:false */

import React, { Fragment, useCallback } from 'react';

import { Either as EitherConfig, Select as SelectConfig } from './ConfigElement';
import MenuGroup from './MenuGroup';
import { useAppDispatch, useAppSelector } from './hooks';

import * as config from './reducers/configuration';
import {
  Editor,
  Orientation,
  PairCharacters,
  Theme,
} from './types';

const MONACO_THEMES = [
  'vs', 'vs-dark', 'vscode-dark-plus',
];

const ConfigMenu: React.FC = () => {
  const keybinding = useAppSelector((state) => state.configuration.ace.keybinding);
  const aceTheme = useAppSelector((state) => state.configuration.ace.theme);
  const monacoTheme = useAppSelector((state) => state.configuration.monaco.theme);
  const theme = useAppSelector((state) => state.configuration.theme);
  const orientation = useAppSelector((state) => state.configuration.orientation);
  const editorStyle = useAppSelector((state) => state.configuration.editor);
  const pairCharacters = useAppSelector((state) => state.configuration.ace.pairCharacters);

  const dispatch = useAppDispatch();
  const changeAceTheme = useCallback((t: string) => dispatch(config.changeAceTheme(t)), [dispatch]);
  const changeMonacoTheme = useCallback((t: string) => dispatch(config.changeMonacoTheme(t)), [dispatch]);
  const changeKeybinding = useCallback((k: string) => dispatch(config.changeKeybinding(k)), [dispatch]);
  const changeTheme = useCallback((t: Theme) => dispatch(config.changeTheme(t)), [dispatch]);
  const changeOrientation = useCallback((o: Orientation) => dispatch(config.changeOrientation(o)), [dispatch]);
  const changeEditorStyle = useCallback((e: Editor) => dispatch(config.changeEditor(e)), [dispatch]);
  const changePairCharacters =
    useCallback((p: PairCharacters) => dispatch(config.changePairCharacters(p)), [dispatch]);

  return (
    <Fragment>
      <MenuGroup title="Editor">
        <SelectConfig
          name="Editor"
          value={editorStyle}
          onChange={changeEditorStyle}
        >
          {[Editor.Simple, Editor.Ace, Editor.Monaco]
            .map(k => <option key={k} value={k}>{k}</option>)}
        </SelectConfig>
        {editorStyle === Editor.Ace && (
          <Fragment>
            <SelectConfig
              name="Keybinding"
              value={keybinding}
              onChange={changeKeybinding}
            >
              {ACE_KEYBINDINGS.map(k => <option key={k} value={k}>{k}</option>)}
            </SelectConfig>

            <SelectConfig
              name="Theme"
              value={aceTheme}
              onChange={changeAceTheme}
            >
              {ACE_THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </SelectConfig>

            <EitherConfig
              id="editor-pair-characters"
              name="Pair Characters"
              a={PairCharacters.Enabled}
              b={PairCharacters.Disabled}
              value={pairCharacters}
              onChange={changePairCharacters} />
          </Fragment>
        )}
        {editorStyle === Editor.Monaco && (
          <Fragment>
            <SelectConfig
              name="Theme"
              value={monacoTheme}
              onChange={changeMonacoTheme}
            >
              {MONACO_THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </SelectConfig>
          </Fragment>
        )}
      </MenuGroup>

      <MenuGroup title="UI">
        <SelectConfig name="Theme" value={theme} onChange={changeTheme}>
          <option value={Theme.System}>System</option>
          <option value={Theme.Light}>Light</option>
          <option value={Theme.Dark}>Dark</option>
        </SelectConfig>

        <SelectConfig
          name="Orientation"
          value={orientation}
          onChange={changeOrientation}
        >
          <option value={Orientation.Automatic}>Automatic</option>
          <option value={Orientation.Horizontal}>Horizontal</option>
          <option value={Orientation.Vertical}>Vertical</option>
        </SelectConfig>
      </MenuGroup>
    </Fragment>
  );
};

export default ConfigMenu;
