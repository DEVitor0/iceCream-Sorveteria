// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// @mui material components
import Card from '@mui/material/Card';

// Soft UI Dashboard React components
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

// Timeline context
import { TimelineProvider } from 'examples/Timeline/context';

function TimelineList({ title, dark, children }) {
  return (
    <TimelineProvider value={dark}>
      <Card>
        <SoftBox bgColor={dark ? 'dark' : 'white'} variant="gradient">
          <SoftBox pt={3} px={3}>
            <SoftTypography
              variant="h6"
              fontWeight="medium"
              color={dark ? 'white' : 'dark'}
            >
              {title}
            </SoftTypography>
          </SoftBox>
          <SoftBox p={2}>{children}</SoftBox>
        </SoftBox>
      </Card>
    </TimelineProvider>
  );
}

// Setting default values for the props of TimelineList
TimelineList.defaultProps = {
  dark: false,
};

// Typechecking props for the TimelineList
TimelineList.propTypes = {
  title: PropTypes.string.isRequired,
  dark: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default TimelineList;
