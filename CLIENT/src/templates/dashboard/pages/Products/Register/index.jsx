import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VerticalMenu from '../../../components/DashboardBar/VerticalMenu/index';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar/index';
import { Upload } from 'lucide-react';
import { debounce } from 'lodash';
import styles from './CadastrarProduto.module.scss';
import ErrorPopup from '../../../../../examples/ErrorPopup/index';
import PreventClosePopup from '../../../../../utils/PreventClosePopup/PreventClosePopup';
import SuccessPopup from '../../../../../examples/Cards/SuccessPopup/SuccessPopup';
import { fetchCsrfToken } from '../../../../../utils/csrf/csurfValidation';

function RegisterProducts() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('edit');

  const fileInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    tag: '',
    webImageUrl: '',
    description: '',
    costPrice: '', // Novo campo
    brand: '', // Novo campo
    quantity: '', // Novo campo
    expirationDate: '', // Novo campo
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const getCsrfToken = async () => {
      const token = await fetchCsrfToken();
      if (token) {
        setCsrfToken(token);
      }
    };

    getCsrfToken();

    if (productId) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/Dashboard/produtos/${productId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const productData = await response.json();
          setFormData({
            ...productData,
            webImageUrl: productData.webImageUrl || '',
            costPrice: productData.costPrice || '', // Novo campo
            brand: productData.brand || '', // Novo campo
            quantity: productData.quantity || '', // Novo campo
            expirationDate: productData.expirationDate || '', // Novo campo
          });
          setPreviewImage(
            productData.imageUrl || productData.webImageUrl || null,
          );

          if (descriptionInputRef.current) {
            descriptionInputRef.current.innerText =
              productData.description || '';
          }
        } catch (error) {
          console.error('Erro ao buscar produto:', error);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (descriptionInputRef.current) {
      descriptionInputRef.current.style.height = 'auto';
      descriptionInputRef.current.style.height = `${descriptionInputRef.current.scrollHeight}px`;
    }
  }, [formData.description]);

  const hasUnsavedChanges = () => {
    return (
      formData.name.trim() !== '' ||
      formData.price !== '' ||
      formData.tag.trim() !== '' ||
      formData.webImageUrl.trim() !== '' ||
      formData.description.trim() !== '' ||
      formData.costPrice !== '' || // Novo campo
      formData.brand.trim() !== '' || // Novo campo
      formData.quantity !== '' || // Novo campo
      formData.expirationDate !== '' || // Novo campo
      previewImage !== null
    );
  };

  const showError = (message) => {
    setErrors((prevErrors) => [...prevErrors, message]);
    setTimeout(() => {
      setErrors((prevErrors) => prevErrors.filter((err) => err !== message));
    }, 3000);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const validateForm = () => {
    const newErrors = [];

    if (
      formData.webImageUrl.trim() &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.webImageUrl)
    ) {
      newErrors.push(
        'URL da imagem inválida. Deve ser um link direto para uma imagem.',
      );
    }

    if (!formData.name.trim()) {
      newErrors.push('O nome do produto é obrigatório.');
    }

    if (!formData.tag.trim()) {
      newErrors.push('A tag do produto é obrigatória.');
    }

    if (Number(formData.price) <= 0 || isNaN(formData.price)) {
      newErrors.push('O preço deve ser um número maior que 0.');
    }

    if (!previewImage && !formData.webImageUrl.trim()) {
      newErrors.push('É necessário fornecer uma imagem (upload ou URL).');
    }

    if (formData.description.length > 500) {
      newErrors.push('A descrição não pode ultrapassar 500 caracteres.');
    }

    if (Number(formData.costPrice) <= 0 || isNaN(formData.costPrice)) {
      newErrors.push('O preço de custo deve ser um número maior que 0.');
    }

    if (Number(formData.quantity) <= 0 || isNaN(formData.quantity)) {
      newErrors.push('A quantidade deve ser um número maior que 0.');
    }

    if (!formData.expirationDate) {
      newErrors.push('A data de validade é obrigatória.');
    } else {
      const today = new Date();
      const expirationDate = new Date(formData.expirationDate);
      if (expirationDate < today) {
        newErrors.push(
          'A data de validade não pode ser anterior à data atual.',
        );
      }
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'webImageUrl' && e.target.value) {
      setPreviewImage(e.target.value);
    }
  };

  const handleDescriptionChange = debounce((e) => {
    const value = e.target.textContent;
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  }, 300);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData((prev) => ({ ...prev, webImageUrl: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      tag: '',
      webImageUrl: '',
      description: '',
      costPrice: '', // Novo campo
      brand: '', // Novo campo
      quantity: '', // Novo campo
      expirationDate: '', // Novo campo
    });
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (descriptionInputRef.current) {
      descriptionInputRef.current.innerText = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csrfToken) {
      showError('CSRF Token não encontrado!');
      return;
    }

    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => showError(error));
      setErrors(validationErrors);
    } else {
      const fileData = fileInputRef.current?.files?.[0];

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('tag', formData.tag);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('costPrice', formData.costPrice); // Novo campo
      formDataToSend.append('brand', formData.brand); // Novo campo
      formDataToSend.append('quantity', formData.quantity); // Novo campo
      formDataToSend.append('expirationDate', formData.expirationDate); // Novo campo

      if (formData.webImageUrl.trim() !== '') {
        formDataToSend.append('webImageUrl', formData.webImageUrl);
      }

      if (fileData) {
        formDataToSend.append('imageFile', fileData);
      }

      try {
        const url = productId
          ? `http://localhost:8443/Dashboard/editar-produtos/${productId}`
          : 'http://localhost:8443/Dashboard/cadastrar';
        const method = productId ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          credentials: 'include',
          headers: {
            'X-CSRF-Token': csrfToken,
          },
          body: formDataToSend,
        });

        if (response.ok) {
          const result = await response.json();
          showSuccess(
            productId
              ? 'Produto atualizado com sucesso!'
              : 'Produto cadastrado com sucesso!',
          );
          console.log('Produto:', result);
          if (!productId) {
            resetForm();
          }
          navigate('/Dashboard/editar-produtos');
        } else {
          const errorData = await response.json();
          showError(
            errorData.message || 'Erro ao cadastrar/atualizar o produto.',
          );
        }
      } catch (error) {
        showError('Erro ao conectar ao servidor.');
        console.error('Erro:', error);
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData((prev) => ({ ...prev, webImageUrl: '' }));
    }
  };

  return (
    <div className={styles.layout}>
      <PreventClosePopup hasUnsavedChanges={hasUnsavedChanges} />

      <div className={styles.verticalMenu}>
        <VerticalMenu />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.navbar}>
          <DashboardNavbar />
        </div>

        {errors.map((error, index) => (
          <ErrorPopup
            key={index}
            message={error}
            onClose={() =>
              setErrors((prevErrors) =>
                prevErrors.filter((err) => err !== error),
              )
            }
          />
        ))}

        {successMessage && (
          <SuccessPopup
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        )}

        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.card__content}>
              <div className={styles.imageSection}>
                <div
                  onClick={handleImageClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`${styles.imageUpload} ${
                    isDragging ? styles.dragging : ''
                  }`}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Não encontrado :("
                      className={styles.imageUpload__preview}
                    />
                  ) : (
                    <div className={styles.imageUpload__placeholder}>
                      <Upload size={48} />
                      <p>Clique para adicionar imagem</p>
                      <p>ou arraste e solte</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className={styles.hidden}
                />
              </div>

              <div className={styles.formSection}>
                <form onSubmit={handleSubmit} className={styles.form}>
                  {/* Linha 1: URL da Imagem e Nome do Produto */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label
                        htmlFor="webImageUrl"
                        className={styles.formGroup__label}
                      >
                        URL da Imagem (opcional)
                      </label>
                      <input
                        type="url"
                        name="webImageUrl"
                        id="webImageUrl"
                        value={formData.webImageUrl}
                        onChange={handleChange}
                        className={`${styles.formGroup__input} ${
                          errors.some((err) =>
                            err.includes('URL da imagem inválida'),
                          )
                            ? styles.inputError
                            : ''
                        }`}
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="name" className={styles.formGroup__label}>
                        Nome do Produto
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`${styles.formGroup__input} ${
                          errors.some((err) =>
                            err.includes('O nome do produto é obrigatório'),
                          )
                            ? styles.inputError
                            : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Linha 2: Marca e Tag */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label
                        htmlFor="brand"
                        className={styles.formGroup__label}
                      >
                        Marca (opcional)
                      </label>
                      <input
                        type="text"
                        name="brand"
                        id="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className={styles.formGroup__input}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="tag" className={styles.formGroup__label}>
                        Tag
                      </label>
                      <input
                        type="text"
                        name="tag"
                        id="tag"
                        value={formData.tag}
                        onChange={handleChange}
                        className={`${styles.formGroup__input} ${
                          errors.some((err) =>
                            err.includes('A tag do produto é obrigatória'),
                          )
                            ? styles.inputError
                            : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Linha 3: Validade e Quantidade */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label
                        htmlFor="expirationDate"
                        className={styles.formGroup__label}
                      >
                        Data de Validade
                      </label>
                      <input
                        type="date"
                        name="expirationDate"
                        id="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleChange}
                        className={`${styles.formGroup__input} ${
                          errors.some((err) =>
                            err.includes('A data de validade é obrigatória.'),
                          )
                            ? styles.inputError
                            : ''
                        }`}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label
                        htmlFor="quantity"
                        className={styles.formGroup__label}
                      >
                        Quantidade
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className={`${styles.formGroup__input} ${
                          errors.some((err) =>
                            err.includes(
                              'A quantidade deve ser um número maior que 0.',
                            ),
                          )
                            ? styles.inputError
                            : ''
                        }`}
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Linha 4: Preço de Compra e Preço de Venda */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label
                        htmlFor="costPrice"
                        className={styles.formGroup__label}
                      >
                        Preço de Compra
                      </label>
                      <div className={styles.formGroup__inputWrapper}>
                        <span className={styles.formGroup__prefix}>R$</span>
                        <input
                          type="number"
                          name="costPrice"
                          id="costPrice"
                          value={formData.costPrice}
                          onChange={handleChange}
                          className={`${styles.formGroup__input} ${
                            styles['formGroup__input--with-prefix']
                          } ${
                            errors.some((err) =>
                              err.includes(
                                'O preço de compra deve ser um número maior que 0.',
                              ),
                            )
                              ? styles.inputError
                              : ''
                          }`}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label
                        htmlFor="price"
                        className={styles.formGroup__label}
                      >
                        Preço de Venda
                      </label>
                      <div className={styles.formGroup__inputWrapper}>
                        <span className={styles.formGroup__prefix}>R$</span>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          value={formData.price}
                          onChange={handleChange}
                          className={`${styles.formGroup__input} ${
                            styles['formGroup__input--with-prefix']
                          } ${
                            errors.some(
                              (err) =>
                                err ===
                                'O preço de venda deve ser um número maior que 0.',
                            )
                              ? styles.inputError
                              : ''
                          }`}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descrição (Opcional) */}
                  <div className={styles.formGroup}>
                    <label
                      htmlFor="description"
                      className={styles.formGroup__label}
                    >
                      Descrição (opcional)
                    </label>
                    <div
                      ref={descriptionInputRef}
                      contentEditable
                      onInput={(e) => {
                        e.persist();
                        handleDescriptionChange(e);
                      }}
                      className={`${styles.formGroup__input} ${
                        styles.descriptionInput
                      } ${
                        formData.description.length > 500 ||
                        errors.some((err) =>
                          err.includes('A descrição não pode ultrapassar'),
                        )
                          ? styles.inputError
                          : ''
                      }`}
                      placeholder="Descreva o produto (máximo de 500 caracteres)"
                    />
                    <small className={styles.formGroup__charCount}>
                      {formData.description.length}/500 caracteres
                    </small>
                  </div>

                  {/* Botão de Submissão */}
                  <button type="submit" className={styles.button}>
                    {productId ? 'Atualizar Produto' : 'Cadastrar Produto'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterProducts;
