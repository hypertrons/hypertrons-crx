import React, { useEffect, useState } from 'react';
import { fire } from 'delegated-events';
import {
  Callout,
  Stack,
  Link,
  Text,
  mergeStyleSets,
  FontWeights,
  DirectionalHint,
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import {
  Command,
  LabelStyles,
  Label2Style,
  getUserNameFromCookie,
} from '../../services/hypertrons';
import {
  getGithubTheme,
  getMessageByLocale,
  runsWhen,
} from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';

const githubTheme = getGithubTheme();

const styles = mergeStyleSets({
  callout: {
    width: 360,
  },
  title: {
    fontWeight: FontWeights.bold,
    marginBottom: 10,
  },
  buttons: {
    marginTop: 20,
    overflow: 'hidden',
  },
});

interface HypertronsTabViewProps {
  hypertronsConfig: any;
}

const HypertronsView: React.FC<HypertronsTabViewProps> = ({
  hypertronsConfig,
}) => {
  const commandsInit: Command[] = [];
  const [settings, setSettings] = useState(new Settings());
  const [settingsInited, setSettingsInited] = useState(false);
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
    useBoolean(false);
  const [userName, setUserName] = useState(null);
  const [userNameInited, setUserNameInited] = useState(false);
  const [commandsCurrent, setCommandsCurrent] = useState(commandsInit);
  const [commandsCurrentInited, setCommandsCurrentInited] = useState(false);

  useEffect(() => {
    const initSettings = async () => {
      const temp = await loadSettings();
      setSettings(temp);
      setSettingsInited(true);
    };
    if (!settingsInited) {
      initSettings();
    }
  }, [settingsInited, settings]);

  useEffect(() => {
    const initUserName = async () => {
      const userNameFromCookie = await getUserNameFromCookie();
      // @ts-ignore
      setUserName(userNameFromCookie['message']);
      setUserNameInited(true);
    };
    if (!userNameInited) {
      initUserName();
    }
  }, [userNameInited, userName]);

  useEffect(() => {
    const initCommandsCurrent = async () => {
      let commandsCanUse = new Set([]);
      if ('role' in hypertronsConfig) {
        // @ts-ignore
        const roleConfig = hypertronsConfig['role'];
        if ('roles' in roleConfig) {
          const rolesConfig = roleConfig['roles'];
          // @ts-ignore
          for (const role of rolesConfig) {
            const roleName = role['name'];
            const usersSet = new Set(role['users']);
            const commands = role['commands'];
            if (usersSet.has(userName) || roleName === 'anyone') {
              for (const command of commands) {
                // @ts-ignore
                commandsCanUse.add(command);
              }
            }
          }
        }
      }
      let commandsFinal: Command[] = [];
      for (const command of commandsCanUse) {
        const commandNew: Command = { command: command };
        commandsFinal.push(commandNew);
      }
      setCommandsCurrent(commandsFinal);
      setCommandsCurrentInited(true);
    };
    if (!commandsCurrentInited && userNameInited) {
      initCommandsCurrent();
    }
  }, [
    userNameInited,
    commandsCurrentInited,
    commandsCurrent,
    hypertronsConfig,
    userName,
  ]);

  const ExecCommand = (command: Command) => {
    const textarea = document.getElementById(
      'new_comment_field'
    ) as HTMLTextAreaElement;
    if (textarea) {
      const commentCurrent = textarea.value;
      let commandExec;
      switch (command.command) {
        case '/start-vote':
          commandExec = `${command.command}  A,B,C,D`;
          break;
        case '/vote':
          commandExec = `${command.command} A`;
          break;
        case '/rerun':
          commandExec = `${command.command} CI`;
          break;
        case '/complete-checklist':
          commandExec = `${command.command} 1 #1`;
          break;
        default:
          commandExec = command.command;
          break;
      }
      const commentNew = `${commentCurrent}${commandExec} `;
      // @ts-ignore
      Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      ).set.call(textarea, commentNew);
      fire(textarea, 'change');
      toggleIsCalloutVisible();
    }
  };

  return (
    <div
      className="color-bg-secondary"
      style={{
        marginRight: 4,
        display: commandsCurrent.length > 0 ? 'block' : 'none',
      }}
    >
      <button
        id="hypertrons_button"
        className="btn"
        onClick={toggleIsCalloutVisible}
        type="button"
      >
        Commands
      </button>
      {isCalloutVisible && (
        <Callout
          gapSpace={0}
          className={styles.callout}
          target={'#hypertrons_button'}
          onDismiss={toggleIsCalloutVisible}
          directionalHint={DirectionalHint.topCenter}
          style={{
            padding: '20px 24px',
          }}
          backgroundColor={githubTheme === 'light' ? 'white' : '#161B22'}
        >
          <Text
            variant="xLarge"
            block
            className={styles.title}
            style={{ color: githubTheme === 'light' ? '#24292F' : '#C9D1D9' }}
          >
            {getMessageByLocale('hypertrons_tab_title', settings.locale)}
          </Text>
          <Text
            variant="medium"
            style={{ color: githubTheme === 'light' ? '#24292F' : '#C9D1D9' }}
          >
            {getMessageByLocale('hypertrons_tab_description', settings.locale)}
            &nbsp;
            <Link
              href={getMessageByLocale('hypertrons_tab_link', settings.locale)}
              target="_blank"
            >
              {getMessageByLocale('golbal_link', settings.locale)}
            </Link>
          </Text>
          <Stack
            className={styles.buttons}
            tokens={{ childrenGap: 8 }}
            horizontal
            horizontalAlign="center"
            wrap
          >
            {commandsCurrent.map((command, index) => {
              const styleIndex = index % (LabelStyles.length - 1);
              return (
                <div
                  key={`command_${index}`}
                  // @ts-ignore
                  style={Label2Style(LabelStyles[styleIndex])}
                  className="IssueLabel hx_IssueLabel"
                  onClick={() => {
                    ExecCommand(command);
                  }}
                >
                  {command.command}
                </div>
              );
            })}
          </Stack>
        </Callout>
      )}
    </div>
  );
};

export default HypertronsView;
