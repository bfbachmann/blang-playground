import React from 'react';

import Link from './uss-router/Link';

import * as styles from './Help.module.css';

import { navigateToIndex } from './reducers/page';

const ORIGINAL_PLAYGROUND_URL = 'https://github.com/rust-lang/rust-playground';
const REPO_URL = 'https://github.com/bfbachmann/blang-playground';
const BLANG_DOCS_URL = 'https://github.com/bfbachmann/blang/tree/master/docs';
const STD_LIB_URL = 'https://github.com/bfbachmann/blang/tree/master/std';

const Help: React.FC = () => {
  return (
    <section className={styles.container}>
      <h1>The Blang Playground</h1>
      <Link action={navigateToIndex}>Return to the playground</Link>

      <LinkableSection id="about" header="About" level="h2">
        <p>
          The playground is an <a href={REPO_URL}>open source project</a>.
          If you have any suggestions for features, issues with the
          implementation, or just want to read the code for yourself,
          you are invited to participate!
        </p>

        <p>
          This playground is copied from the <a href={ORIGINAL_PLAYGROUND_URL}>Rust Playground</a>.
        </p>
      </LinkableSection>

      <LinkableSection id="about" header="Language Documentation" level="h2">
        <p>
          High-level language documentation can be found in the <a href={BLANG_DOCS_URL}>Blang repository</a>.
        </p>

      </LinkableSection>

      <LinkableSection id="about" header="Imports" level="h2">
        <p>
          For now, only modules from the <a href={STD_LIB_URL}>standard library</a> can be imported in the playground.
        </p>

      </LinkableSection>

      <LinkableSection id="limitations" header="Limitations" level="h2">
        <p>
          To prevent the playground from being used to attack other computers and
          to ensure it is available for everyone to use, some limitations
          are enforced.
        </p>

        <dl>
          <dt>Network</dt>
          <dd>
            There is no network connection available during compilation or
            execution of user-submitted code.
          </dd>

          <dt>Memory</dt>
          <dd>
            The amount of memory the compiler and resulting executable use is
            limited.
          </dd>

          <dt>Execution Time</dt>
          <dd>
            The total compilation and execution time is limited.
          </dd>

          <dt>Disk</dt>
          <dd>
            The total disk space available to the compiler and resulting
            executable is limited.
          </dd>
        </dl>
      </LinkableSection>
    </section>
  );
};

const LinkableSection: React.FC<LinkableSectionProps> = ({
  id, header, level: Level, children,
}) => (
  <div id={id}>
    <Level>
      <span className={styles.header}>
        <a className={styles.headerLink} href={`#${id}`}>{header}</a>
      </span>
    </Level>
    {children}
  </div>
);

interface LinkableSectionProps {
  children: React.ReactNode;
  id: string;
  header: string;
  level: React.ElementType;
}

const Code: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <code className={styles.code}>{children}</code>
);

export default Help;
