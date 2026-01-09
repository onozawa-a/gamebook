import React, { useState, useCallback } from 'react';
import GameScreen from './components/GameScreen';
import storyData from './data/story.json';
import { Container, Typography, Box } from '@mui/material';

function App() {
  const [currentSceneId, setCurrentSceneId] = useState(1);
  const [inventory, setInventory] = useState([]);
  const [playerHp, setPlayerHp] = useState(20);
  const [combatState, setCombatState] = useState(null);

  const handleChoice = useCallback((choice) => {
    // 選択肢にアクションがあれば実行
    if (choice.action) {
      // 戦闘開始処理
      if (choice.action.type === 'START_BATTLE') {
        const enemy = storyData[currentSceneId].enemy;
        setCombatState({
          ...enemy,
          maxHp: enemy.hp,
          log: `${enemy.name}が現れた！`
        });
        return;
      }

      // 戦闘中の攻撃処理
      if (choice.action.type === 'ATTACK' && combatState) {
        // プレイヤーの攻撃 (2〜5のダメージ)
        const damageToEnemy = Math.floor(Math.random() * 4) + 2;
        const newEnemyHp = combatState.hp - damageToEnemy;

        if (newEnemyHp <= 0) {
          // 勝利
          setCombatState(null);
          setCurrentSceneId(combatState.winNextId);
          return;
        }

        // 敵の攻撃 (1〜敵の攻撃力のダメージ)
        const damageToPlayer = Math.floor(Math.random() * combatState.attack) + 1;
        const newPlayerHp = playerHp - damageToPlayer;
        setPlayerHp(newPlayerHp);

        if (newPlayerHp <= 0) {
          // 敗北
          setCombatState(null);
          setCurrentSceneId(13); // ゲームオーバーシーンへ
          return;
        }

        // 戦闘継続：ログと敵HPを更新
        setCombatState(prev => ({
          ...prev,
          hp: newEnemyHp,
          log: `あなたの攻撃！ ${damageToEnemy}のダメージを与えた。\n${prev.name}の反撃！ ${damageToPlayer}のダメージを受けた。`
        }));
        return;
      }

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

    // ゲームリセット時の処理
    if (choice.nextId === 1) {
      setPlayerHp(20);
      setInventory([]);
      setCombatState(null);
    }

    // 次のシーンへ移動
    setCurrentSceneId(choice.nextId);
  }, [currentSceneId, combatState, playerHp]);

  // 表示するシーンを決定（戦闘中は動的に生成）
  let currentScene = storyData[currentSceneId];
  if (combatState) {
    currentScene = {
      text: `${combatState.log}\n\n【${combatState.name}】 HP: ${combatState.hp} / ${combatState.maxHp}`,
      choices: [
        { text: "攻撃する", action: { type: 'ATTACK' } }
      ]
    };
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ゲームブック
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          HP: {playerHp}
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