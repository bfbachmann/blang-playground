import React, { useCallback, useRef } from 'react';

import { ButtonSet, IconLink, Button as OneButton } from './ButtonSet';
import {
  BuildIcon,
  HelpIcon,
} from './Icon';
import * as actions from './actions';
import { useAppDispatch, useAppSelector } from './hooks';
import { performGistSave } from './reducers/output/gist';
import { navigateToHelp } from './reducers/page';
import * as selectors from './selectors';

import * as styles from './Header.module.css';

const Header: React.FC = () => {
  const menuContainer = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div data-test-id="header" className={styles.container}>
        <div className={styles.left}>
          <ButtonSet>
            <ExecuteButton />
          </ButtonSet>
        </div>

        <div className={styles.right}>
          <ButtonSet>
            <ShareButton />
          </ButtonSet>

          <ButtonSet>
            <HelpButton />
          </ButtonSet>
        </div>
      </div>

      <div ref={menuContainer} />
    </>
  );
};

const ExecuteButton: React.FC = () => {
  const executionLabel = useAppSelector(selectors.getExecutionLabel);

  const dispatch = useAppDispatch();
  const execute = useCallback(() => dispatch(actions.performPrimaryAction()), [dispatch]);

  return (
    <OneButton isPrimary type="button" onClick={execute} iconRight={BuildIcon}>
      {executionLabel}
    </OneButton>
  );
};

const ShareButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const gistSave = useCallback(() => dispatch(performGistSave()), [dispatch]);

  return (
    <OneButton type="button" title="Create shareable links to this code" onClick={gistSave}>
      Share
    </OneButton>
  );
};

const HelpButton: React.FC = () => (
  <IconLink title="View help" action={navigateToHelp}>
    <HelpIcon />
  </IconLink>
);

export default Header;
