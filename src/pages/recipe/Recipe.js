import { useParams } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useEffect, useState } from 'react';
import { projectFirestore } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

// icon
import loader from '../../assets/loading.svg';
import editIcon from '../../assets/edit.svg';

// styles
import './Recipe.css';

const Recipe = () => {
  const { id } = useParams();
  const { mode } = useTheme();
  const navigate = useNavigate();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    setIsPending(true)

    const recipeCollection = projectFirestore.collection('recipes');
    const documentReference = recipeCollection.doc(id);
    const unsub = documentReference.onSnapshot(snapshot => {
      if (snapshot.exists) {
        setIsPending(false)
        setRecipe(snapshot.data())
        setError(false);
      } else {
        setIsPending(false)
        setError(`Could not find that recipe`)
      }
    })

    return () => unsub();
  }, [id]);

  return(
    <div className={`recipe ${mode}`}>
      {error && <p className='error'>{error}</p>}
      {isPending && <div className='loader-image'>
        <img 
          src={loader}
          alt='loading'
          style={{filter: mode === 'dark' ? 'invert(100%)': 'invert(20%)'}}
        />
      </div>}
      {recipe && (
        <>
          <h2 className='page-title'>{recipe.title}</h2>
          <p>Takes {recipe.cookingTime} to cook.</p>
          <ul>
            {recipe.ingredients.map(ing => <li key={ing}>{ing}</li>)}
          </ul>
          <p className='method'>{recipe.method}</p>
        </>
      )}
      <img 
        className='edit-icon'
        src={editIcon}
        alt='Edit Recipe'
        onClick={() => navigate(`/edit/${id}`)}
        style={{filter: mode === 'dark' ? 'invert(100%)': 'invert(20%)'}}
      />
    </div>
  )
};

export default Recipe;