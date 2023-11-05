import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        完整的教學文檔，讓你使用起來非常簡單!
      </>
    ),
  },
  {
    title: '讓你了解與學習到更多事!',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        這個論壇主要可以發表意見、公告、學習心得等，如同線上版的中興國中!
      </>
    ),
  },
  {
    title: '由React架設',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        開發者首次使用React開發網頁，如果有bug請多多見諒
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
