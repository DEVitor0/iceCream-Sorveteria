import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import TitleServices from '../../../titleServices/index';
import Subtitle from '../../../subtitle/index';
import BlockWithImage from '../BlockWithImage/index';
import TestimotyTextContainer from '../Testimony/TestimotyTextContainer';
import CarouselControls from '../BlockWithCounter/BlockWithCounter'; // Importe o componente de controles
import testimonials from '../data/dates'; // Importe seus dados
import image from '../../../../../utils/imageManager/imageManager';
import Styles from './testimonialsContainer.module.scss';

// Variantes de animação (mantenha as existentes)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const imageVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.6, 0.0, 0.0, 0.9],
    },
  },
};

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'backOut',
    },
  },
};

const TestimonialsContainer = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Estado para controlar o depoimento atual

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('visible');
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1,
      },
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [controls]);

  return (
    <motion.div
      ref={ref}
      className={Styles.testimonialContainer}
      style={{ backgroundImage: `url(${image.testimunials})` }}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <motion.div
        className={Styles.testimonialContainer__imageContainer}
        variants={imageVariants}
      >
        <BlockWithImage />
      </motion.div>

      <motion.div
        className={Styles.testimonialContainer__textContainer}
        variants={containerVariants}
      >
        <motion.div
          className={Styles.testimonialContainer__textContainer__title}
          variants={itemVariants}
        >
          <Subtitle text="Depoimentos" />
          <motion.div variants={itemVariants}>
            <TitleServices text="O que dizem sobre nós?" />
          </motion.div>
        </motion.div>

        <motion.div
          className={Styles.testimonialContainer__textContainer__Testimoty}
          variants={cardVariants}
        >
          <TestimotyTextContainer
            testimonial={testimonials[currentIndex]} // Passa o depoimento atual
          />
        </motion.div>

        <motion.div
          className={
            Styles.testimonialContainer__textContainer__blockWithCounter
          }
          variants={itemVariants}
        >
          <CarouselControls
            count={testimonials.length}
            current={currentIndex}
            onChange={setCurrentIndex}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TestimonialsContainer;
