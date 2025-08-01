import React, { useState, useEffect } from 'react';
import TitleServices from '../../titleServices/index';
import Subtitle from '../../subtitle/index';
import TagsNavBar from '../../../../examples/Navbars/TagsNavBar/TagsNavBar';
import ProductsContainer from './Products/PruductsContainer/ProductsContainer';
import './styles.scss';

const OurProducts = () => {
  const [selectedTag, setSelectedTag] = useState(null);
  const [debouncedTag, setDebouncedTag] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTag(selectedTag);
    }, 500); // Atraso de 500ms

    return () => {
      clearTimeout(timer);
    };
  }, [selectedTag]);

  const handleTagSelect = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  return (
    <section className="ourProducts">
      <div className="ourProducts__title">
        <TitleServices id="ourProducts-title" text="Cardápio" />
        <Subtitle id="ourProducts-subtitle" text="Conheça o nosso cardápio" />
      </div>

      <TagsNavBar selectedTag={selectedTag} onTagSelect={handleTagSelect} />
      <ProductsContainer selectedTag={debouncedTag} />
    </section>
  );
};

export default OurProducts;
