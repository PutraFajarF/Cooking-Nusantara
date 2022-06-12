import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/config';

//icon
import deleteIcon from '../assets/delete.svg';
import editIcon from '../assets/edit.svg';


// styles
import './RecipeList.css';

const RecipeList = ({recipes, isDeleted}) => {
  const { color, mode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [addedRecipe, setAddedRecipe] = useState(null);
  const [updatedRecipe, setUpdatedRecipe] = useState(null);

  useEffect(() => {
    if(location.state) {
        if(location.state.addedRecipe) {
          setAddedRecipe(location.state.addedRecipe);
        } else if (location.state.updatedRecipe){
          setUpdatedRecipe(location.state.updatedRecipe);
        }
        setTimeout(() => {
          location.state = null;
          setAddedRecipe(null);
          setUpdatedRecipe(null);
        }, [3000])
    }
  }, [location])

  if (recipes.length === 0) {
    return <div className={`error ${mode}`}>No recipes to load...</div>
  }

  const handleClick = async (id) => {
    setAddedRecipe(null);
    const collectionRef = projectFirestore.collection('recipes');
    const docToDelete = collectionRef.doc(id);
    await docToDelete.delete();
  }

  return(
    <>
      <div className='delete-alert-container' style={{display: isDeleted ? 'flex' : 'none'}}>
        <div className={isDeleted ? 'delete-alert show' : 'delete-alert'}>
          {`Recipe Deleted!`}
        </div>
      </div>

      <div className='add-alert-container' style={{display: addedRecipe ? 'flex' : 'none'}}>
        <div className={addedRecipe ? 'add-alert show' : 'add-alert'}>
          {`Recipe ${addedRecipe ? 'for ' + addedRecipe.title : '' } Added!`}
        </div>
      </div>
      
      <div className='update-alert-container' style={{display: updatedRecipe ? 'flex' : 'none'}}>
        <div className={updatedRecipe ? 'update-alert show' : 'update-alert'}>
          {`Recipe Updated!`}
        </div>
      </div>

      <div className='recipe-list'>
        {recipes.map((recipe) => (
          <div key={recipe.id} className={`card ${mode}`}>
            <h3>{recipe.title}</h3>
            <p>{recipe.cookingTime}</p>
            <div>{recipe.method.substring(0, 100)}...</div>
            <Link to={`recipes/${recipe.id}`} style={{background: color, color: '#eee'}}>Cook This</Link>
            <img 
              className="delete-icon"
              onClick={() => handleClick(recipe.id)}
              src={deleteIcon} 
              alt="delete icon" 
              style={{filter: mode === 'dark' ? 'invert(100%)': 'invert(20%)'}}
            />
            <img 
              className='edit-icon'
              src={editIcon}
              alt='Edit Recipe'
              onClick={() => navigate(`/edit/${recipe.id}`)}
              style={{filter: mode === 'dark' ? 'invert(100%)': 'invert(20%)'}}
            />
          </div>
        ))}
      </div>
    </>
  )
};
      
export default RecipeList;