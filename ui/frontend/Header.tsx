import React, { RefObject, useCallback, useRef } from 'react';

import BuildMenu from './BuildMenu';
import { ButtonSet, IconButton, IconLink, Button as OneButton } from './ButtonSet';
import ConfigMenu from './ConfigMenu';
import {
  BuildIcon,
  ConfigIcon,
  ExpandableIcon,
  HelpIcon,
  MoreOptionsIcon,
} from './Icon';
import PopButton, { ButtonProps } from './PopButton';
import * as actions from './actions';
import { useAppDispatch, useAppSelector } from './hooks';
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
            <BuildMenuButton menuContainer={menuContainer} />
          </ButtonSet>
        </div>

        <div className={styles.right}>
          <ButtonSet>
            <ConfigMenuButton menuContainer={menuContainer} />
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

interface PortalProps {
  menuContainer: RefObject<HTMLDivElement>;
}

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

const BuildMenuButton: React.FC<PortalProps> = ({ menuContainer }) => {
  const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ toggle }, ref) => (
      <IconButton type="button" title="Select what to build" ref={ref} onClick={toggle}>
        <MoreOptionsIcon />
      </IconButton>
  ));
  Button.displayName = 'BuildMenuButton.Button';

  return <PopButton Button={Button} Menu={BuildMenu} menuContainer={menuContainer} />;
};

const ConfigMenuButton: React.FC<PortalProps> = ({ menuContainer }) => {
  const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ toggle }, ref) => (
      <OneButton
          type="button"
          title="Show the configuration options"
          ref={ref}
          onClick={toggle}
          iconLeft={ConfigIcon}
          iconRight={ExpandableIcon}
      >
        Config
      </OneButton>
  ));
  Button.displayName = 'ConfigMenuButton.Button';

  return <PopButton Button={Button} Menu={ConfigMenu} menuContainer={menuContainer} />;
};

const HelpButton: React.FC = () => (
  <IconLink title="View help" action={navigateToHelp}>
    <HelpIcon />
  </IconLink>
);

export default Header;
