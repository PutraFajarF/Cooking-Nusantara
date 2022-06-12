import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { projectFirestore } from '../../firebase/config';

// component
import RecipeList from '../../components/RecipeList';

// Icon loader
import loader from '../../assets/loading.svg';

// styles
import './Search.css';

const Search = () => {
  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const query = queryParams.get('q');

  const { mode } = useTheme();

  const [recipes, setRecipes] = useState(null);
  const [error, setError] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setError(false);
    setIsPending(true);
    setRecipes(null);
    const collectionRef = projectFirestore.collection('recipes');
    collectionRef.get().then(docs => {
      let docArray = [];
      docs.forEach(doc => {
        if(doc.data().title.toLowerCase().includes(query.toLowerCase())) {
         docArray.push({id: doc.id, ...doc.data()})
        }     
       })
      setIsPending(false);
      setRecipes(docArray);
    })
  }, [query])

  return (
    <div>
      <h2 className={`page-title ${mode}`}>Recipes including "{query}"</h2>
      {error && <p className={`error ${mode}`}>{error}</p>}
      {isPending && <div className='loading'>
        <img 
          src={loader} 
          alt='Loading'
          style={{filter: mode === 'dark' ? 'invert(100%)': 'invert(20%)'}}
        />
      </div>}
      {recipes && (
        <div className='search-result'>
          <RecipeList recipes={recipes}/>
        </div>
      )}
    </div>
  )
}

export default Search;