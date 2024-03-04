import React, { useCallback } from 'react';

import ButtonMenuItem from './ButtonMenuItem';
import MenuGroup from './MenuGroup';
import * as actions from './actions';
import { useAppDispatch } from './hooks';

import * as styles from './BuildMenu.module.css';

interface BuildMenuProps {
  close: () => void;
}

const useAppDispatchAndClose = (action: () => actions.ThunkAction, close: () => void) => {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    dispatch(action());
    close();
  }, [action, close, dispatch]);
};

const BuildMenu: React.FC<BuildMenuProps> = (props) => {
  const compile = useAppDispatchAndClose(actions.performCompile, props.close);
  const compileToAssembly = useAppDispatchAndClose(actions.performCompileToAssembly, props.close);
  const compileToLLVM = useAppDispatchAndClose(actions.performCompileToLLVM, props.close);
  const execute = useAppDispatchAndClose(actions.performExecute, props.close);

  return (
    <MenuGroup title="What do you want to do?">
      <ButtonMenuItem name="Run" onClick={execute}>
        Build and run the code, showing the output. Equivalent to <Code>blang run</Code>.
      </ButtonMenuItem>
      <ButtonMenuItem name="Build" onClick={compile}>
        Build the code without running it. Equivalent to <Code>blang build</Code>.
      </ButtonMenuItem>
      <ButtonMenuItem name="ASM" onClick={compileToAssembly}>
        Build and show the resulting assembly code.
      </ButtonMenuItem>
      <ButtonMenuItem name="LLVM IR" onClick={compileToLLVM}>
        Build and show the resulting LLVM IR, LLVM’s intermediate representation.
      </ButtonMenuItem>
    </MenuGroup>
  );
};

const Code: React.FC<{ children: string }> = ({ children }) => (
  <code className={styles.code}>{children}</code>
);

export default BuildMenu;
