import React, { useState, useCallback } from 'react';
import GameScreen from './components/GameScreen';
import storyData from './data/story.json';
import { Container, Typography, Box } from '@mui/material';

function App() {
  const [currentSceneId, setCurrentSceneId] = useState(1);
  const [inventory, setInventory] = useState([]);

  const handleChoice = useCallback((choice) => {
    // 選択肢にアクションがあれば実行
    if (choice.action) {
      if (choice.action.type === 'GET_ITEM') {
        // 持ち物にアイテムを追加（重複しないように）
        setInventory(prevInventory => {
          if (!prevInventory.includes(choice.action.item)) {
            return [...prevInventory, choice.action.item];
          }
          return prevInventory;
        });
      }
    }
    // 次のシーンへ移動
    setCurrentSceneId(choice.nextId);
  }, []);

  const currentScene = storyData[currentSceneId];

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ゲームブック
        </Typography>
        <GameScreen
          scene={currentScene}
          inventory={inventory}
          onChoice={handleChoice}
        />
      </Box>
    </Container>
  );
}

export default App;