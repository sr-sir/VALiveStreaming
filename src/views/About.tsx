import React, { useState } from 'react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack } from '@fluentui/react/lib/Stack';

const About: React.FC = () => {
  const [hideDialog, setHideDialog] = useState(true);

  const showDialog = () => setHideDialog(false);
  const closeDialog = () => setHideDialog(true);

  // 定义对话框的样式
  const dialogStyles = {
    main: {
      width: 1000, // 设置宽度为 500px
      height: 900, // 设置高度为自动调整
      display: 'flex',
    },
  };

  return (
    <div>
      <PrimaryButton text="Open Dialog" onClick={showDialog} />
      <Dialog
        hidden={hideDialog}
        onDismiss={closeDialog}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Define Live Streaming',
        }}
        modalProps={{
          isBlocking: false,
          styles: dialogStyles,
        }}
      >
        <Stack>
          <TextField label="Livestreaming Name" />
          <TextField label="Description" />
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={closeDialog} text="Save" />
          <DefaultButton onClick={closeDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default About;
