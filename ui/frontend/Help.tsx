import React from 'react';

import Example from './HelpExample';
import Link from './uss-router/Link';

import styles from './Help.module.css';

import integer32Logo from './assets/integer32-logo.svg';
import { navigateToIndex } from './reducers/page';

const ACE_URL = 'https://github.com/ajaxorg/ace';
const CLIPPY_URL = 'https://github.com/rust-lang/rust-clippy';
const MIRI_URL = 'https://github.com/rust-lang/miri';
const CRATES_IO_URL = 'https://crates.io/';
const RUST_COOKBOOK_URL = 'https://rust-lang-nursery.github.io/rust-cookbook/';
const CRATES_URL = 'https://github.com/rust-lang/rust-playground/blob/main/compiler/base/Cargo.toml';
const GIST_URL = 'https://gist.github.com/';
const I32_URL = 'http://integer32.com/';
const LOCALSTORAGE_URL = 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API';
const ORIGINAL_PLAYGROUND_URL = 'https://github.com/rust-lang/rust-playground';
const REPO_URL = 'https://github.com/bfbachmann/blang-playground';
const BLANG_DOCS_URL = 'https://github.com/bfbachmann/blang/tree/master/docs';
const RUSTFMT_URL = 'https://github.com/rust-lang/rustfmt';
const SHEPMASTER_URL = 'https://github.com/shepmaster/';
const RUST_EDITION_2018_URL = 'https://doc.rust-lang.org/edition-guide/rust-2018/index.html';

const CRATE_EXAMPLE = `use rand::Rng;

fn main() {
    let mut rng = rand::thread_rng();
    println!("{}", rng.gen::<u8>());
}`;

const CLIPPY_EXAMPLE = `fn main() {
    match true {
        true => println!("true"),
        false => println!("false"),
    }
}`;

const MIRI_EXAMPLE = `fn main() {
    let mut a: [u8; 0] = [];
    unsafe {
        *a.get_unchecked_mut(1) = 1;
    }
}`;

const RUSTFMT_EXAMPLE = `// wow, this is ugly!
fn main ()
{ struct Foo { a: u8, b: String, }
match 4 {2=>{},_=>{}} }`;

const LINK_EXAMPLE = 'https://play.integer32.com/?code=fn main() { println!("hello world!"); }';

const TEST_EXAMPLE = `#[test]
fn test_something() {
    assert_ne!(42, 0);
}`;

const LIBRARY_EXAMPLE = `#![crate_type="lib"]

pub fn library_fn() -> u8 {
    42
}`;

const OUTPUT_EXAMPLE = `#[inline(never)]
pub fn a_loop() -> i32 {
    let mut sum = 0;
    for i in 0..100 {
        sum += i;
    }
    sum
}

fn main() {
    println!("{}", a_loop());
}`;

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
