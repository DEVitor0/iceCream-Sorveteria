import React, { useState } from 'react';
import TitleServices from '../../titleServices/index';
import Subtitle from '../../subtitle/index';
import TagsNavBar from '../../../../examples/Navbars/TagsNavBar/TagsNavBar';
import ProductsContainer from './Products/PruductsContainer/ProductsContainer';
import './styles.scss';

const OurProducts = () => {
  const [selectedTag, setSelectedTag] = useState(null);

  // Função para lidar com a seleção de tags
  const handleTagSelect = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  return (
    <section className="ourProducts">
      <div className="ourProducts__title">
        <TitleServices id="ourProducts-title" text="Cardápio" />
        <Subtitle id="ourProducts-subtitle" text="Conheça o nosso cardápio" />
      </div>

      {/* Passando a tag selecionada e a função de seleção */}
      <TagsNavBar selectedTag={selectedTag} onTagSelect={handleTagSelect} />

      {/* Passando a tag selecionada para o ProductsContainer */}
      <ProductsContainer selectedTag={selectedTag} />
    </section>
  );
};

export default OurProducts;
