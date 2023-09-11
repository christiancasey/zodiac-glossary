import React from "react";
import { IoIosTrash } from "react-icons/io";

import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const Categories = props => {
  const {user} = React.useContext(UserContext);
  
  const [style, setStyle] = React.useState({display: 'none'});
  
  if (user && !user.token) {
		let categoryList = props.categories.reduce((list, category) => list + ', ' + category.category, '').substring(2);
    return (
			<div className={styles.row}>
				<div className={styles.label}>Categories</div>
				<div className={styles.label}>
					{categoryList}
				</div>
			</div>
    )
  }

  return (
		<>
			<div>Categories</div>
			{props.categories.map(category => (
				<div 
					onMouseEnter={e => {
						if (user.token)
							setStyle({display: 'block'});
					}}
					onMouseLeave={e => {
						setStyle({display: 'none'});
					}}
					key={category.category_id}
				>
					{/* <label className={styles.label} htmlFor={"meaning_category_" + category.category_id}>{i+1}</label> */}
					<input 
						type="text"
						name={"category_" + category.category_id}
						id={"category_" + category.category_id}
						className={styles.inputMeaning}
						placeholder="new category"
						value={category.category}
						list="meaning_categories"
						onChange={e => props.updateCategory(e.target.value, props.meaning.id, category.category_id)}
					/>
					<datalist id="meaning_categories">
						{props.meaningsCategories.map((category, key) => (
							<option
								key={key}
								value={category}
							/>
						))}
					</datalist>
					{/* 
					<input
						style={{display: (user.token || meaning.category ? 'inline' : 'none')}}
						className={styles.inputMeaning}
						type="text"
						name={"category_"+meaning.id}
						id={"category_"+meaning.id}
						placeholder="category"
						value={meaning.category}
						onChange={e => props.updateMeaning('category', e.target.value, meaning.id)}
						list="meaning_categories"
					/>
					<datalist id="meaning_categories">
						{props.meaningsCategories.map((category, key) => (
							<option
								key={key}
								value={category}
							/>
						))}
					</datalist>
					<input
						style={{display: (user.token || meaning.comment ? 'inline' : 'none')}}
						className={styles.inputMeaning}
						type="text"
						name={"comment_"+meaning.id}
						id={"comment_"+meaning.id}
						placeholder={user.token ? "comment" : ''}
						value={(meaning.comment ? meaning.comment : '')}
						onChange={e => props.updateMeaning('comment', e.target.value, meaning.id)}
					/> */}
					{/* <button className={styles.delete} style={style} onClick={() => props.deleteMeaning(meaning.id)}><IoIosTrash /></button> */}
				</div>

			))}
		</>
  );
};

export default Categories;