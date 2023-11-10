import React from 'react';
import Collapsible from "react-collapsible";
import {MdExpandMore, MdExpandLess} from 'react-icons/md';

import styles from '../Content.module.css'

import { getContributions } from "../../Data/contributors";

import UserContext from '../../Contexts/UserContext';

const Contributors = props => {
  const [contributors, setContributors] = React.useState([]);

  React.useEffect(() => {
    getContributions()
    .then(data => {
      // Add contributions list to each contributor object
      data.contributors = data.contributors.map(contributor => {
        contributor.contributions = data.contributions.filter(contribution => (contribution.username === contributor.username));
        return contributor;
      });
      setContributors(data.contributors);
    })
    .catch(error => console.error(error));
  }, []);

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Contributors</h1>
        <ul>
          {contributors.map(contributor => (
            <Contributions contributor={contributor} />
          ))}
        </ul>
      </div>
    </div>
  );
};

const Contributions = props => {
  return (
    <li>
      {props.contributor.first_name}&nbsp;
      {props.contributor.last_name}
      <Collapsible 
        trigger={<MdExpandMore />}
        triggerWhenOpen={<MdExpandLess />}
        contentContainerTagName="span"
        transitionTime={200}
      >
        <ul>
          {props.contributor.contributions.map(lemma => {
            return (
              <li key={lemma.lemma_id}>
              <a 
                href={"/"+lemma.lemma_id} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {lemma.transliteration} | {lemma.original} | {lemma.primary_meaning}
              </a>
              </li>
            )
          })}
        </ul>
      </Collapsible>
    </li>
  )
};

export default Contributors;