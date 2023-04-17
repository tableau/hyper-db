import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import 'react-vertical-timeline-component/style.min.css';

import clsx from 'clsx';
import styles from './index.module.css';

export function HyperTimeline() {
    return (
        <VerticalTimeline layout="2-columns" lineColor="var(--ifm-color-primary)" className="vertical-timeline-custom">
            <VerticalTimelineElement icon={<img src={useBaseUrl('img/journey_tum.png')} />} date="2008">
                <h3 className="vertical-timeline-element-title">Hyper Started as a Research Project</h3>
                <p>
                    In 2008 and under the guidance of professors Alfons Kemper and Thomas Neumann, the journey of Hyper
                    started as a research project at the <a href="https://www.tum.de">Technical University of Munich</a>
                    . Strictly speaking, Hyper was then written HyPer with a capital P as an acronym for &quot;
                    <strong>Hy</strong>brid High <strong>Per</strong>formance&quot;. As part of the Tableau acquisition
                    in 2016, HyPer became Hyper. Legend has it that{' '}
                    <a href="https://www.youtube.com/watch?v=7Twnmhe948A">
                        a popular 90&#39;s techno song called <em>Hyper Hyper</em>
                    </a>{' '}
                    had influenced the name finding, but that is in the realm of urban myths.
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement icon={<img src={useBaseUrl('img/journey_tum.png')} />} date="over the next years">
                <h3 className="vertical-timeline-element-title">Hyper's Success in Academia</h3>
                <p>
                    <a href="https://hyper-db.com/index.html#publications">
                        More than 50 peer-reviewed articles about Hyper
                    </a>{' '}
                    have been published in journals as well as in the proceedings of various database conferences and
                    workshops. Several of these publications and demos have received awards, including awards at the
                    prestigious IEEE ICDE, ACM SIGMOD, and VLDB conferences. We are especially honored that two of our
                    foundational publications have received the test of time award, one of the highest distinctions in
                    the database research community:
                </p>
                <ul>
                    <li>
                        <p>
                            The first academic publication on the Hyper database system has been published in the
                            proceedings of the IEEE International Conference on Data Engineering 2011 (&quot;
                            <a href="https://ieeexplore.ieee.org/document/5767867?arnumber=5767867">
                                HyPer: A hybrid OLTP&amp;OLAP main memory database system based on virtual memory
                                snapshots
                            </a>
                            &quot;, ICDE 2011) and has received the{' '}
                            <a href="http://tab.computer.org/tcde/icde_inf_paper.html">
                                IEEE ICDE 10-year influential paper award
                            </a>{' '}
                            in 2021.
                        </p>
                    </li>
                    <li>
                        <p>
                            &quot;
                            <a href="https://www.vldb.org/pvldb/vol4/p539-neumann.pdf">
                                Efficiently Compiling Efficient Query Plans for Modern Hardware
                            </a>
                            &quot;, published in the proceedings of the 37th International Conference on Very Large Data
                            Bases 2011 (VLDB 2011), has received the VLDB 2021 Test of Time Award. This publication
                            describes the foundation of Hyper&#39;s compiling query execution engine and was the first
                            to introduce data-centric code generation and compilation for query processing on modern
                            hardware. The then-novel technique that Thomas Neumann had pioneered in Hyper has been
                            adopted by many of the leading database engines over the past decade. Alongside vectorized
                            query processing, query compilation is one of the two state-of-the-art processing paradigms
                            for fast query processing.
                        </p>
                    </li>
                </ul>
            </VerticalTimelineElement>
            <VerticalTimelineElement icon={<img src={useBaseUrl('img/journey_hyper.png')} />} date="2015">
                <h3>Hyper Startup</h3>
                <p>
                    In 2015, the six co-founders Dr. Jan Finis, Prof. Alfons Kemper, Ph.D., Prof. Dr. Viktor Leis, Dr.
                    Tobias Muehlbauer, Prof. Dr. Thomas Neumann, and Dr. Wolf Roediger founded the Hyper spinoff startup
                    with the mission to develop a database that disrupts the way people manage and analyze data on
                    modern hardware.
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement icon={<img src={useBaseUrl('img/journey_hyper_tableau.png')} />} date="2016">
                <h3>Tableau acquires Hyper</h3>
                <p>
                    In March 2016, Hyper was{' '}
                    <a href="https://www.prnewswire.com/news-releases/tableau-acquires-hyper-300233581.html">
                        acquired by Tableau
                    </a>
                    .
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement icon={<img src={useBaseUrl('img/journey_hyper_tableau.png')} />} date="2018">
                <h3>Hyper Powers Tableau</h3>
                <p>
                    In January 2018 and after 18 months of integration,{' '}
                    <a href="https://www.tableau.com/about/press-releases/2018/tableau-launches-hyper-new-data-engine-technology-delivering-unprecedented">
                        Tableau shipped version 10.5 of its products, all powered by Hyper as its new data engine
                    </a>
                    . With Hyper&#39;s ability to slice and dice massive volumes of data in seconds, Tableau customers
                    got up to 5X faster query speeds and up to 3X faster extract creation speeds compared to the
                    previous Tableau data engine. This allowed faster insights for even larger data sets, giving
                    organizations the ability to scale their analysis to more people. Later in 2018,{' '}
                    <a href="https://www.tableau.com/about/press-releases/2018/tableau-expands-platform-new-product-tableau-prep">
                        Tableau launched its novel Prep product powered by Hyper as its data processing engine
                    </a>
                    . Prep delivered new data preparation capabilities that brought a direct and visual experience. Data
                    prep was made simple and the integration with the Tableau analytical workflow allowed people to get
                    insights from their cleaned and enriched data sets even faster.
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement icon={<img src={useBaseUrl('img/journey_api.png')} />} date="2019">
                <h3>Launch of Hyper API</h3>
                <p>
                    In 2019, Tableau launched <a href="/docs/">Hyper API</a>. The API allows customers and partners to
                    automate their integrations with Tableau extracts, including the creation of new extract files as
                    well as inserting, deleting, updating, and reading data from existing extracts. Hyper API was the
                    first solution to expose Hyper&#39;s SQL capabilities to Tableau&#39;s end customers and partners.
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                icon={<img src={useBaseUrl('img/journey_hyper_tableau_salesforce.png')} />}
                date="2021"
            >
                <h3>Hyper at Salesforce</h3>
                <p>
                    Hyper expands beyond Tableau where it processes billions of queries every month thereby enabling
                    customers to interactively analyze the freshest state of their data. The team&#39;s goal is to bring
                    this proven experience to more Salesforce customers by making the Hyper technology and services
                    available to development teams in more Salesforce Clouds. At the same time, the Hyper team continues
                    to support existing Tableau customers and partners with ever-improving performance and new
                    functionality.
                </p>
            </VerticalTimelineElement>
        </VerticalTimeline>
    );
}

export default function OurJourney(): JSX.Element {
    return (
        <>
            <Layout
                title="Our Journey"
                description="Hyper's journey from a research project towards an industry-hardened database"
            >
                <main>
                    <header className={clsx('hero', styles.heroBanner)}>
                        <div className="container padding-top--md padding-bottom--lg">
                            <h1 className="hero__title">Hyper's journey</h1>
                            <p className="hero__subtitle">
                                from a research project towards an industry-hardened database
                            </p>
                        </div>
                    </header>
                    <HyperTimeline />
                </main>
            </Layout>
        </>
    );
}
