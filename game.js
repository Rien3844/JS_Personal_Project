import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor(hp, ap) {
    this.hp = 100;
    this.ap = 5;
  }

  attack(monster = new Monster(), damage) {
    // 플레이어의 공격
    monster.hp -= damage;
  }
}

class Monster {
  constructor(hp, ap) {
    this.hp = 100;
    this.ap = 2.5;
  }

  attack(player = new Player(), damage) {
    // 몬스터의 공격
    player.hp -= damage;
  }
}

function displayStatus(stage, player, monster) {
  //player = new Player();
  //monster = new Monster();
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
  player = new Player();
  monster = new Monster();

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

    console.log(chalk.green(`\n1. 공격한다 2. 아무것도 하지않는다. 3. 게임 종료`));
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리

    switch (choice) {
      case '1':
        logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
        player.attack(monster, player.ap);
        logs.push(`몬스터에게 ${player.ap}의 피해를 입혔습니다.`);
        monster.attack(player, monster.ap);
        //return monster.hp;

        break;
      case '2':
        logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
        logs.push(`턴을 넘깁니다.`);
        monster.attack(player, monster.ap);
        //return player.hp;
        break;
      case '3':
        logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
        logs.push(`게임 종료. ${process.exit(0)}`);
        break;
      default:
        console.log(chalk.red('올바른 선택을 하세요.'));
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
    stage++;
    // 스테이지 클리어 및 게임 종료 조건
  }
}
