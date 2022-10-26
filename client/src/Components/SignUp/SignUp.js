import React from 'react';

import styles from '../Content.module.css';

const SignUp = props => {
  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Sign Up</h1>
        <p>Note that this feature is currently only available to members of the <a href="https://www.geschkult.fu-berlin.de/en/e/zodiac/index.html" target="_blank" rel="noopener noreferrer">Zodiac Project</a>.</p>
        <p>All new sign ups require direct approval from the Zodiac team.</p>
        
        <fieldset style={{border: 'none', margin: 0, padding: 0}}>
          <form>
            
          </form>
        </fieldset>
      </div>
    </div>
  )
};

export default SignUp;