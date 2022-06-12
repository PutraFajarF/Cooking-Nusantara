import { projectFirestore } from '../../firebase/config';
import { useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

// icon
import loader from '../../assets/loading.svg';

//styles
import './Home.css';

// components
import RecipeList from '../../components/RecipeList';

const Home = () => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);
  const [deletedRecipe, setDeletedRecipe] = useState(false);

  const { mode } = useTheme();

  useEffect(() => {
    setIsPending(true);

    const recipesCollection = projectFirestore.collection('recipes');
    const unsub = recipesCollection.onSnapshot((snapshot) => {
      if (snapshot.empty) {
        setError('No recipes to load');
        setData(null);
        setIsPending(false);
      } else {
        if(snapshot.docChanges()[0]._delegate.type === 'removed') {
          setDeletedRecipe(true);
          setTimeout(() => {
            setDeletedRecipe(false)
          }, 3000)
        } else {
            setDeletedRecipe(false);
        }
        let results = [];
        snapshot.docs.forEach(doc => {
          results.push({ ...doc.data(), id: doc.id })
        });
        setData(results);
        setError(false);
        setIsPending(false);
      }
    }, (err) => {
      setError(err.message);
      setIsPending(false);
    })

    return () => unsub();
  }, []);

  return (
    <div className='home'>
      {error && <p className={`error ${mode}`}>{error}</p>}
      {isPending && <div className='loader-image'>
        <img 
          src={loader}
          alt='loading'
          style={{filter: mode === 'dark' ? 'invert(100%)': 'invert(20%)'}}
        />
      </div>}
      {data && <RecipeList recipes={data} isDeleted={deletedRecipe}/>}
    </div>
  )
};

export default Home;