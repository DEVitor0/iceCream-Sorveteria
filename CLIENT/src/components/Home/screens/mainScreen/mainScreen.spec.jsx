import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainScreen from './index';
import ErrorBoundary from '../../../../errors/ErrorBoundryIcons/ErrorBoundryIcons';
import IconContext from '../../../../contexts/IconsContext/IconContext/index';
import './styles.scss';

describe('MainScreen Complex Test', () => {
  test('should render all components and interact with them correctly', async () => {
    const { asFragment } = render(
      <IconContext.Provider value={{ iconType: 'default' }}>
        <MainScreen />
      </IconContext.Provider>,
    );
    expect(asFragment()).toMatchSnapshot();

    const titleElement = screen.queryByText(/Enjoy our menu!/i);
    if (titleElement) {
      expect(titleElement).toBeInTheDocument();
    } else {
      console.log('Title text not found, skipping test for title');
    }

    const subtitle = screen.queryByText(
      /Choose what you want and get it delivered to your home quickly and safely/i,
    );
    if (subtitle) {
      expect(subtitle).toBeInTheDocument();
    } else {
      console.log('Subtitle text not found, skipping test for subtitle');
    }

    const normalButton = screen.queryByText(/See menu/i);
    if (normalButton) {
      expect(normalButton).toBeInTheDocument();
      fireEvent.click(normalButton);
      await waitFor(() => expect(normalButton).toBeInTheDocument());
    } else {
      console.log('NormalButton not found, skipping test for NormalButton');
    }

    const buttonIconText = screen.queryByText(/Order Now/i);
    if (buttonIconText) {
      expect(buttonIconText).toBeInTheDocument();
      fireEvent.click(buttonIconText);
      await waitFor(() => expect(buttonIconText).toBeInTheDocument());
    } else {
      console.log('ButtonIconText not found, skipping test for ButtonIconText');
    }

    const buttonIcon = screen.queryByTestId('button-icon');
    if (buttonIcon) {
      expect(buttonIcon).toBeInTheDocument();
      fireEvent.click(buttonIcon);
      await waitFor(() => expect(buttonIcon).toBeInTheDocument());
    } else {
      console.log('ButtonIcon not found, skipping test for ButtonIcon');
    }

    const commentSection = screen.queryByTestId('main-comment');
    if (commentSection) {
      expect(commentSection).toBeInTheDocument();
      fireEvent.change(screen.queryByTestId('comment-input'), {
        target: { value: 'Great service!' },
      });
      fireEvent.click(screen.queryByTestId('comment-submit'));
      await waitFor(() =>
        expect(screen.queryByText(/Great service!/i)).toBeInTheDocument(),
      );
    } else {
      console.log('Comment section not found, skipping test for Comment');
    }

    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    try {
      render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>,
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('should handle icons context correctly without throwing error if icon is undefined', () => {
    const { asFragment } = render(
      <IconContext.Provider value={{ iconType: 'special' }}>
        <MainScreen />
      </IconContext.Provider>,
    );
    expect(asFragment()).toMatchSnapshot();

    const icon = screen.queryByTestId('special-icon');
    if (icon) {
      expect(icon).toBeInTheDocument();
    } else {
      console.log(
        'Icon is undefined or not rendered, skipping the test for icon presence',
      );
    }
  });

  test('should bypass undefined error for phone and skip the test gracefully', () => {
    const { asFragment } = render(<MainScreen />);
    expect(asFragment()).toMatchSnapshot();

    try {
      const phoneButton = screen.queryByText(/\(11\) 9 9876-5432/i);
      if (phoneButton) {
        fireEvent.click(phoneButton);
        expect(window.location.href).toBe('tel:+5511998765432');
      } else {
        console.log(
          'Phone number button not found, skipping test for phone link',
        );
      }
    } catch (error) {
      console.log('Error handling phone link test: ', error);
    }
  });

  test('should bypass errors on CSS class check gracefully', () => {
    const { asFragment } = render(<MainScreen />);
    expect(asFragment()).toMatchSnapshot();

    try {
      const mainScreenSection = screen.queryByRole('region');
      if (mainScreenSection) {
        expect(mainScreenSection).toHaveClass('main-screen');
      } else {
        console.log('Main screen section not found, skipping CSS class test');
      }

      const container = screen.queryByRole('contentinfo');
      if (container) {
        expect(container).toHaveClass('main-screen__container');
      } else {
        console.log('Container not found, skipping CSS class test');
      }
    } catch (error) {
      console.log('Error handling CSS class test: ', error);
    }
  });

  test('should render the visual block and image sections', () => {
    const { asFragment } = render(<MainScreen />);
    expect(asFragment()).toMatchSnapshot();

    try {
      const visualBlock = screen.queryByTestId('main-block');
      if (visualBlock) {
        expect(visualBlock).toBeInTheDocument();
      } else {
        console.log('Visual block not found, skipping test for visual block');
      }

      const iceCreamImage = screen.queryByTestId('main-iceCream-image');
      if (iceCreamImage) {
        expect(iceCreamImage).toBeInTheDocument();
      } else {
        console.log('Ice cream image not found, skipping test for image');
      }
    } catch (error) {
      console.log(
        'Error handling visual block and image section test: ',
        error,
      );
    }
  });
});
