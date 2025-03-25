import {
  Button,
  Card,
  Title1,
  Body1,
  Combobox,
  Option,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@fluentui/react-components';
import { BookmarkRegular } from '@fluentui/react-icons';

export default function Index() {
  return (
    <Card style={{ maxWidth: '400px', margin: '20px' }}>
      <Title1>Fluent UI + Remix</Title1>
      <Body1>Welcome to your new app!</Body1>
      <Button appearance="primary" icon={<BookmarkRegular />}>
        Click me
      </Button>
      <Combobox placeholder="Select an animal">
        {['Dog', 'Cat', 'Ferret'].map((option) => (
          <Option key={option} disabled={option === 'Ferret'}>
            {option}
          </Option>
        ))}
      </Combobox>
      <Dialog>
        <DialogTrigger disableButtonEnhancement>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Dialog title</DialogTitle>
            <DialogContent>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              exercitationem cumque repellendus eaque est dolor eius expedita
              nulla ullam? Tenetur reprehenderit aut voluptatum impedit
              voluptates in natus iure cumque eaque?
            </DialogContent>
            <DialogActions>
              <Button appearance="primary">Do Something</Button>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Close</Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </Card>
  );
}
