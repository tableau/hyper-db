import UseCaseIcon from '../../static/img/tableau-logo.svg';
import { Link } from "react-router-dom";

# Hyper for Tableau Users

<UseCaseIcon className="usecase-icon" />

## What is Hyper?

Hyper is a relational database management system, that can handle both analytical and transactional workloads. It started as a research project at Technical Unversity of Munich (TUM) and evolved into a successful startup before being acquired by Tableau. It has received numerous awards in the database research community.

<Link className="button button--secondary" to="/journey">
    Learn more about the journey of Hyper
</Link>

## Tableau - powered by Hyper

Tableau provides explorative analytics and reporting capabilities to its customers.
For that purpose, Tableau needs 

## What is Hyper doing in Tableau?

Hyper is runnning in the background of all Tableau products, including Tableau Desktop, Tableau Prep, Tableau Server, and Tableau Cloud. There it performs all the calculations and aggregations on the data that is required to create Tableau Vizzes. Hyper runs both on small personal computers, as well as in the cloud, where it utilizes up to hundreds of cores. With Hyper's processing power, Tableau customers can quickly analyze massive amounts of data and gain insights faster.

## What are Tableau Extracts?

To achieve its performance, Hyper stores the data in its own binary format in `.hyper` files.
When data is extracted into `.hyper` files to make them faster accessible for Tableau, they are called **Tableau Extracts**.

## What is the Tableau Hyper API?

Tableau Hyper API is an free application programming interface that allows to create and modify Tableau extracts outside of Tableau.

<Link className="button button--secondary" to="/docs/hyper-api">
    Get Started with Tableau Hyper API
</Link>
