import { Button, Stack } from '@chakra-ui/react';
import styles from './styles.module.css';

interface WizardStep2Props {
  onBack: () => void;
  onSubmit: () => void;
}

export default function WizardStep2({ onBack, onSubmit }: WizardStep2Props) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Step 2: Details & Submit</h2>

      <Stack gap={4}>

        <div className={styles.actions}>
          <Button onClick={onBack} colorPalette="gray">
            Back
          </Button>
          <Button onClick={onSubmit} colorPalette="blue">
            Submit
          </Button>
        </div>
      </Stack>
    </div>
  );
}
