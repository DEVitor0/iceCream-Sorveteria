import React, { useState, useRef, useEffect } from 'react';
import VerticalMenu from '../../dashboard/components/DashboardBar/VerticalMenu/index';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar/index';
import { Upload } from 'lucide-react';
import styles from './CadastrarProduto.module.scss';
import ErrorPopup from '../../../examples/ErrorPopup/index';
import PreventClosePopup from '../../../utils/PreventClosePopup/PreventClosePopup';
import SuccessPopup from '../../../examples/Cards/SuccessPopup/SuccessPopup';
import { fetchCsrfToken } from '../../../utils/csrf/csurfValidation'; // Importando a função para buscar o token CSRF

function RegisterProducts() {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    tag: '',
    imageUrl: '',
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
  }, []);

  const hasUnsavedChanges = () => {
    return (
      formData.name.trim() !== '' ||
      formData.price.trim() !== '' ||
      formData.tag.trim() !== '' ||
      formData.imageUrl.trim() !== '' ||
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

    if (!formData.name.trim()) {
      newErrors.push('O nome do produto é obrigatório.');
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.push('O preço deve ser um número maior que 0.');
    }

    if (!formData.tag.trim()) {
      newErrors.push('A tag do produto é obrigatória.');
    }

    if (!previewImage && !formData.imageUrl.trim()) {
      newErrors.push('É necessário fornecer uma imagem (upload ou URL).');
    }

    newErrors.forEach((error) => showError(error));

    return newErrors.length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'imageUrl' && e.target.value) {
      setPreviewImage(e.target.value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData((prev) => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csrfToken) {
      showError('CSRF Token não encontrado!');
      return;
    }

    if (validateForm()) {
      const fileData = fileInputRef.current?.files?.[0];

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('tag', formData.tag);
      formDataToSend.append('imageUrl', formData.imageUrl);

      if (fileData) {
        formDataToSend.append('imageFile', fileData);
      }

      try {
        const response = await fetch(
          'http://localhost:8443/Dashboard/cadastrar',
          {
            method: 'POST',
            credentials: 'include', // Permite envio de cookies
            headers: {
              'X-CSRF-Token': csrfToken,
            },
            body: formDataToSend,
          },
        );

        if (response.ok) {
          const result = await response.json();
          showSuccess('Produto cadastrado com sucesso!'); // Exibe mensagem de sucesso
          console.log('Produto cadastrado:', result.newProduct);
        } else {
          const errorData = await response.json();
          showError(errorData.message || 'Erro ao cadastrar o produto.');
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
      setFormData((prev) => ({ ...prev, imageUrl: '' }));
    }
  };

  return (
    <div className={styles.layout}>
      {/* Componente para prevenir fechamento acidental */}
      <PreventClosePopup hasUnsavedChanges={hasUnsavedChanges} />

      <div className={styles.verticalMenu}>
        <VerticalMenu />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.navbar}>
          <DashboardNavbar />
        </div>

        {/* Pop-ups de erro */}
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

        {/* Pop-up de sucesso */}
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
                  <div className={styles.formGroup}>
                    <label
                      htmlFor="imageUrl"
                      className={styles.formGroup__label}
                    >
                      URL da Imagem (opcional)
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className={styles.formGroup__input}
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
                      className={styles.formGroup__input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="price" className={styles.formGroup__label}>
                      Preço
                    </label>
                    <div className={styles.formGroup__inputWrapper}>
                      <span className={styles.formGroup__prefix}>R$</span>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`${styles.formGroup__input} ${styles['formGroup__input--with-prefix']}`}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
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
                      className={styles.formGroup__input}
                    />
                  </div>

                  <button type="submit" className={styles.button}>
                    Cadastrar Produto
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
