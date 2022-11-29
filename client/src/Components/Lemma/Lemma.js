import React from "react";
import { useParams, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { getLemma, saveLemmaToDB, deleteLemmaFromDB } from "../../Data/sample-data";
import { getLemmaDB } from "../../Data/api";

import BasicInfo from './BasicInfo';
// import Meanings from './Meanings';
// import Variants from './Variants';
// import Quotations from './Quotations';
// import CrossLinks from './CrossLinks';
// import ExternalLinks from './ExternalLinks';
// import DeleteLemma from './DeleteLemma';

import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const Lemma = props => {
  let navigate = useNavigate();
  let location = useLocation();
  const {user} = React.useContext(UserContext);
  
  // Really stupid cludge that forces the sidebar to update when the user saves a new lemma
  // It's either this or raise all of the lemma state and redo the routing just for that one edge case
  let [updateLemmataList, changed, setChanged] = useOutletContext(); 
  
  let params = useParams();
  let [lemma, setLemma] = React.useState({});
  
  React.useEffect(() => {
    // setLemma(getLemma(params.lemmaId));
    const lemmaId = parseInt(params.lemmaId);
    console.log(params.lemmaId);

    if(lemmaId) {
      getLemmaDB(setLemma, lemmaId);
    }
  }, [params.lemmaId]);


  React.useEffect(() => {
    console.log(lemma);
  }, [lemma]);
  
  // Keyboard shortcuts
  const handleKeyPress = e => {
    // Meta keys
    if (e.ctrlKey || e.metaKey) {
      // Save shortcuts (ctrl+s and cmd+s)
      if (e.key === 's') {
        e.preventDefault();
        setChanged(false);
        saveLemma();
      }
    }
  };
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  });

  const onChange = e => {
    if (e.target.type === "checkbox") {
      setLemma(prevLemma => {
        return {
          ...prevLemma,
          [e.target.name]: e.target.checked
        }
      });
    } else {
      setLemma(prevLemma => {
        return {
          ...prevLemma,
          [e.target.name]: e.target.value
        }
      });
    }
    setChanged(true);
  };
  
  const saveLemma = () => {
    updateLemmataList();
    setChanged(false);
    saveLemmaToDB(lemma);
  };
  
  const deleteLemma = () => {
    deleteLemmaFromDB(lemma.lemmaId);
    setLemma(null);
    navigate('/zodiac-routing/' + location.search);
  }
  
  const updateMeaning = (updatedMeaning, id) => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        meanings: prevLemma.meanings.map(meaning => {
          if (meaning.id === id) {
            meaning.value = updatedMeaning;
          }
          return meaning;
        })
      }
    });
    setChanged(true);
  };

  const deleteMeaning = id => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        meanings: prevLemma.meanings.filter(meaning => {
          return meaning.id !== id;
        }),
      };
    });
    setChanged(true);
  };

  const addNewMeaning = e => {
    e.preventDefault();
    
    const newMeaning = {
      id: uuidv4(),
      value: '',
    };
    
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        meanings: [
          ...prevLemma.meanings,
          newMeaning
        ]
      };
    });
    setChanged(true);
  };

  const updateVariant = (key, updatedVariant, id) => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        variants: lemma.variants.map(variant => {
          if (variant.id === id) {
            variant[key] = updatedVariant;
          }
          return variant;
        })
      }
    });
    setChanged(true);
  };

  const deleteVariant = id => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        variants: prevLemma.variants.filter(variant => {
          return variant.id !== id;
        }),
      };
    });
    setChanged(true);
  };

  const addNewVariant = e => {
    e.preventDefault();
    
    const newVariant = {
      id: uuidv4(),
      original: '',
      transliteration: '', 
    };
    
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        variants: [
          ...prevLemma.variants,
          newVariant
        ]
      };
    });
    setChanged(true);
  };

  const updateQuotation = (key, updatedQuotation, id) => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        quotations: lemma.quotations.map(quotation => {
          if (quotation.id === id) {
            quotation[key] = updatedQuotation;
          }
          return quotation;
        })
      }
    });
    setChanged(true);
  };

  const deleteQuotation = id => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        quotations: prevLemma.quotations.filter(quotation => {
          return quotation.id !== id;
        }),
      };
    });
    setChanged(true);
  };

  const addNewQuotation = e => {
    e.preventDefault();
    
    const newQuotation = {
      id: uuidv4(),
      original: '',
      transliteration: '',
      translation: '',
      source: '',
      genre: '',
      provenance: '',
      date: '',
      publication: '',
      link: '',
    }
    
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        quotations: [
          ...prevLemma.quotations,
          newQuotation
        ]
      };
    });
    setChanged(true);
  };
  
  //////////////////////////////////////////////////////////////////////////////
  // EXTERNAL LINKS
  const updateExternalLink = (key, updatedexternalLink, id) => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        externalLinks: lemma.externalLinks.map(externalLink => {
          if (externalLink.id === id) {
            externalLink[key] = updatedexternalLink;
          }
          return externalLink;
        }),
      }
    });
    setChanged(true);
  };

  const deleteExternalLink = id => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        externalLinks: prevLemma.externalLinks.filter(externalLink => {
          return externalLink.id !== id;
        }),
      };
    });
    setChanged(true);
  };

  const addNewExternalLink = e => {
    e.preventDefault();
    const newExternalLink = {
      id: uuidv4(),
      url: '',
      display: '',
    }
    
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        externalLinks: [
          ...prevLemma.externalLinks,
          newExternalLink
        ]
      };
    });
    setChanged(true);
  };
  
  //////////////////////////////////////////////////////////////////////////////
  // CROSS LINKS
  const updateCrossLink = (updatedCrosslink, id) => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        crosslinks: lemma.crosslinks.map(crosslink => {
          if (crosslink.id === id) {
            crosslink.link = updatedCrosslink;
          }
          return crosslink;
        }),
      }
    });
    setChanged(true);
  };

  const deleteCrossLink = id => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        crosslinks: prevLemma.crosslinks.filter(crosslink => {
          return crosslink.id !== id;
        }),
      };
    });
    setChanged(true);
  };

  const addNewCrossLink = e => {
    e.preventDefault();
    console.log('addNewCrossLink()');
    const newCrosslink = {
      id: uuidv4(),
      link: '',
    }
    
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        crosslinks: [
          ...prevLemma.crosslinks,
          newCrosslink
        ]
      };
    });
    setChanged(true);
  };
  
  
  // Default display when an invalid lemma id is in the URL params
  if (params.lemmaId && !lemma) {
    return (
      <main className={styles.lemma}>
        <h2>Lemma</h2>
        <div style={{opacity: 0.5}}>
          <p>The lemma ID in the URL does not correspond to a valid lemma.</p>
          <p>Perhaps the lemma you are looking for has been deleted.</p>
          <p>Please select a new lemma from the options on the left.</p>
        </div>
      </main>
    );
  }
  // Default display when no lemma is selected
  if (!params.lemmaId) {
    return (
      <main className={styles.lemma}>
        <h2>Lemma</h2>
        <div style={{opacity: 0.5}}>
          <p>No lemma selected.</p>
          <p>Please select a lemma from the options on the left.</p>
        </div>
      </main>
    );
  }
  
  // Full lemma display
  return (
    <main className={styles.lemma}>
      <h1>
        {changed ? <i>Lemma (unsaved)</i> : 'Lemma'}
        {(user && user.token) ? (
          <button className={styles.delete} onClick={() => saveLemma()}>SAVE</button>
        ) : null}
      </h1>
      
      <fieldset disabled={user.token===null} style={{border: 'none', margin: 0, padding: 0}}>
        
        <BasicInfo lemma={lemma} onChange={onChange} />
        {/* <Meanings
          meanings={lemma.meanings}
          updateMeaning={updateMeaning}
          addNewMeaning={addNewMeaning}
          deleteMeaning={deleteMeaning}
        />
        
        <Variants
          variants={lemma.variants}
          updateVariant={updateVariant}
          addNewVariant={addNewVariant}
          deleteVariant={deleteVariant}
        />
        
        <Quotations
          quotations={lemma.quotations}
          updateQuotation={updateQuotation}
          addNewQuotation={addNewQuotation}
          deleteQuotation={deleteQuotation}
        />
        
        <CrossLinks
          crosslinks={lemma.crosslinks}
          updateCrossLink={updateCrossLink}
          addNewCrossLink={addNewCrossLink}
          deleteCrossLink={deleteCrossLink}
        />
        
        <ExternalLinks
          externalLinks={lemma.externalLinks}
          updateExternalLink={updateExternalLink}
          addNewExternalLink={addNewExternalLink}
          deleteExternalLink={deleteExternalLink}
        />
        
        <DeleteLemma lemma={lemma} deleteLemma={deleteLemma} /> */}
      </fieldset>
      
    </main>
  );
};

export default Lemma;