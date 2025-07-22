import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

function Feature({title, description}: {title: string, description: ReactNode}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <Feature
            title="Tech Docs"
            description={
              <>
                Dive into our comprehensive documentation to learn about installation, configuration, and usage of my projects on{' '}
                <a href="https://github.com/CutTheCrapTech" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>.
              </>
            }
          />
          <Feature
            title="Tech Blog"
            description={
              <>
                Check out my blog for the latest news, updates, and tutorials about the project on{' '}
                <a href="https://github.com/CutTheCrapTech" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>.
              </>
            }
          />
          <Feature
            title="Personal Blog"
            description={
              <>
                Read my personal blog for my thoughts and ramblings.
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}