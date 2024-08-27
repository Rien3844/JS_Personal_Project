import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
    this.ap = 15;
  }

  // 플레이어의 공격
  attack(monster = new Monster(), damage) {
    monster.hp -= damage;
  }
  upstage(stage) {
    this.hp += 15 + random(20, 40);
    this.ap += random(1, 4);
  }
  cheat() {
    return (this.hp = 9999), (this.ap = 9999);
  }
}

class Monster {
  constructor(stage) {
    this.hp = 50 + stage * random(5, 10);
    this.ap = 7 + stage;
  }

  // 몬스터의 공격
  attack(player = new Player(), damage) {
    player.hp -= damage;
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function displayStatus(stage, player, monster) {
  if (stage >= 2) {
    console.log(
      `스테이지 클리어!
      레벨업 했습니다. 플레이어의 체력이 ${player.hp}, 공격력이 ${player.ap}로 상승하고 몬스터가 강해졌습니다.`,
    );
  }
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(`| 플레이어 정보 - HP : ${player.hp}, AP : ${player.ap}`) +
      chalk.redBright(`| 몬스터 정보 - HP : ${monster.hp}, AP : ${monster.ap}|`),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    if (monster.hp <= 0) {
      break;
    }
    if (player.hp <= 0) {
      break;
    }
    console.log(chalk.green(`\n1. 공격한다 2. 연속공격(25%) 3. 방어(40%) 4. 도주(3%)`));
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리

    switch (choice) {
      case '1':
        logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
        player.attack(monster, player.ap);
        logs.push(`몬스터에게 ${player.ap}의 피해를 입혔습니다.`);
        monster.attack(player, monster.ap);

        break;
      case '2':
        logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
        if (100 - random(0, 100) < 25) {
          logs.push(`연속 공격 성공!`);
          player.attack(monster, player.ap);
          logs.push(`몬스터에게 ${player.ap}의 피해를 입혔습니다.`);
          player.attack(monster, player.ap);
          logs.push(`몬스터에게 ${player.ap}의 피해를 입혔습니다.`);
        } else {
          logs.push(`연속 공격 실패...몬스터에게 공격받습니다.`);
          monster.attack(player, monster.ap);
        }
        break;
      case '3':
        logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
        if (100 - random(0, 100) < 40) {
          logs.push(`방어 성공!`);
          player.hp += random(5, 30);
          logs.push(`체력이 소폭 회복됩니다.`);
        } else {
          logs.push(`방어 실패...몬스터에게 공격받습니다.`);
          monster.attack(player, monster.ap);
        }
        break;
      case '4':
        logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
        if (100 - random(0, 100) < 5) {
          monster.hp = 0;
          logs.push(`도주 성공!`);
        } else {
          logs.push(`도주 실패...몬스터에게 공격받습니다.`);
          monster.attack(player, monster.ap);
          break;
        }
      case '0':
        logs.push(chalk.bgYellowBright(`치트모드 발동.`));
        player.cheat();
        break;
      default:
        logs.push(chalk.red('올바른 선택을 하세요.'));
    }
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건
    if (stage === 10) {
      console.log('게임 클리어!');
      process.exit(0);
    }
    if (monster.hp <= 0) {
      console.log('몬스터 처치! 다음층으로 갑니다.');
      stage++;
      if (stage > 1 && player.hp > 0) {
        player.upstage();
      }
    } else if (player.hp <= 0) {
      console.log('게임오버');
      process.exit(0);
    }
  }
}
