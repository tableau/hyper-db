import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

type FeatureItem = {
    title: string;
    href: string;
    Svg: React.ComponentType<React.ComponentProps<'svg'>>;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Hyper for Tableau Users',
        href: '/docs/usescases/tableau',
        Svg: require('@site/static/img/tableau-logo.svg').default,
        description: (
            <>
                Hyper is the database engine powering Tableau and serving it with super-sonic 
            </>
        ),
    },
    {
        title: 'Tableau for Data Scientists',
        href: '/docs/usescases/datascience',
        Svg: require('@site/static/img/flask-svgrepo-com.svg').default,
        description: (
            <>
                Take advantage of the power of Hyper using the Tableau Hyper API for C++, Java, Python and DotNet.
            </>
        ),
    },
    {
        title: 'Hyper for Database Researchers',
        href: '/docs/usescases/research',
        Svg: require('@site/static/img/mortarboard-svgrepo-com.svg').default,
        description: (
            <>
                Hyper began as an academic research project at the Technical University of Munich (TUM) and it's technology was presented in many award-winning papers.
            </>
        ),
    },
];

function Feature({ title, href, Svg, description }: FeatureItem) {
    return (
        <div className={clsx('col col--4')} style={{"display": "block"}}>
            <Link to={href}>
                <div className="text--center">
                    <Svg className={styles.featureSvg} role="img" />
                </div>
                <div className="text--center padding-horiz--md">
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
            </Link>
        </div>
    );
}

export default function HomepageFeatures(): JSX.Element {
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
