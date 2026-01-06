import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';

function GameScreen({ scene, inventory, onChoice }) {
  if (!scene) {
    return <Typography>シーンが見つかりません。</Typography>;
  }

  // 選択肢が有効かどうかを判定する
  const isChoiceDisabled = (choice) => {
    if (!choice.condition) {
      return false; // 条件がなければ常に有効
    }
    if (choice.condition.item) {
      // 必要なアイテムを持っているかチェック
      return !inventory.includes(choice.condition.item);
    }
    return false;
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ whiteSpace: 'pre-wrap', mb: 3 }} paragraph>
          {scene.text}
        </Typography>

        {inventory.length > 0 && (
          <Box sx={{ mb: 2, textAlign: 'left' }}>
            <Typography variant="subtitle2">持ち物:</Typography>
            {inventory.map(item => (
              <Chip key={item} label={item} sx={{ mr: 1, mt: 1 }} />
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {scene.choices.map((choice, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={() => onChoice(choice)}
              disabled={isChoiceDisabled(choice)}
            >
              {choice.text}
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export default GameScreen;