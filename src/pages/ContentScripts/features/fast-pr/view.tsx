import React, { useState, useEffect } from 'react';
import { FormOutlined } from '@ant-design/icons';
import { FloatButton, Modal, Form, Input, Button } from 'antd';
import * as githubService from './githubService';
import * as giteeService from './giteeService';
import { GET_FILE_URL as GITEE_FILE_URL } from './giteeUrl';
import { handleMessage } from './handleMessage';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import { useTranslation } from 'react-i18next';
import { getGiteeToken } from '../../../../helpers/gitee-token';
import { getGithubToken } from '../../../../helpers/github-token';
import { PR_TITLE, PR_CONTENT } from './baseContent';
interface Props {
  filePath: string;
  originalRepo: string;
  branch: string;
  platform: string;
  horizontalRatio: number;
  verticalRatio: number;
}
const View = ({ filePath, originalRepo, branch, platform, horizontalRatio, verticalRatio }: Props) => {
  const [giteeToken, setGiteeToken] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const { t, i18n } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Initial button position
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 }); // Starting position when mouse is pressed
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Offset when dragging
  const [dragged, setDragged] = useState(false); // Flag to detect if drag occurred
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // Create form instance
  const [fileContent, setFileContent] = useState('');
  const buttonSize = 50; // Button size
  const padding = 24; // Padding from the screen edges

  const [isTextSelected, setIsTextSelected] = useState(false);

  const dragThreshold = 5; // Threshold to distinguish dragging from clicking
  const GITHUB_FILE_URL = (filePath: string, originalRepo: string, branch: string) =>
    `https://raw.githubusercontent.com/${originalRepo}/${branch}/${filePath}`;
  // Click the icon
  const clickIcon = () => {
    const key = 'stackedit';
    if (platform === 'Github') {
      if (githubToken === '') {
        handleMessage('error', t('github_token_not_found'), key);
        return;
      }
    } else {
      if (giteeToken === '') {
        handleMessage('error', t('gitee_token_not_found'), key);
        return;
      }
    }
    const Stackedit = require('stackedit-js');
    const stackedit = new Stackedit();
    let originalContent = '';
    let content = '';
    if (platform === 'Github') {
      fetch(GITHUB_FILE_URL(filePath, originalRepo, branch))
        .then((response) => {
          if (!response.ok) {
            handleMessage('error', t('network_error_load_file', { status: response.status }), key);
          }
          return response.text();
        })
        .then((data) => {
          document.body.style.overflow = 'hidden';
          originalContent = data;
          stackedit.openFile({ content: { text: originalContent } });
        })
        .catch((error) => {
          handleMessage('error', t('fetch_error_file', { error: error.message }), key);
        });
    } else {
      fetch(GITEE_FILE_URL(filePath, originalRepo), {
        method: 'GET',
        headers: {
          Authorization: `token ${giteeToken}`,
          Accept: 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            handleMessage('error', t('network_error_load_file', { status: response.status }), key);
          }
          return response.json();
        })
        .then((data) => {
          // Decoding base64 content
          const base64Content = data.content;
          const binaryString = atob(base64Content);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          // Using TextDecoder to process UTF-8 encoding
          const decoder = new TextDecoder('utf-8');
          const decodedContent = decoder.decode(bytes);
          document.body.style.overflow = 'hidden';
          originalContent = decodedContent;
          stackedit.openFile({ content: { text: decodedContent } });
        })
        .catch((error) => {
          handleMessage('error', t('fetch_error_file', { error: error.message }), key);
        });
    }

    stackedit.on('fileChange', (file: any) => {
      content = file.content.text;
      setFileContent(content);
    });

    stackedit.on('close', () => {
      document.body.style.overflow = '';
      if (originalContent.charCodeAt(originalContent.length - 1) === 10) {
        content += String.fromCharCode(10);
        setFileContent(content);
      }
      if (originalContent != content) {
        // If content has changed, handle PR creation
        setIsModalOpen(true);
        form.resetFields();
      }
    });
  };
  // Modal cancel handler
  const handleCancel = () => {
    setIsModalOpen(false); // Close modal without action
    form.resetFields();
  };

  // Set the initial position to the middle-right of the screen when the component loads
  useEffect(() => {
    const initialX = (window.innerWidth - buttonSize) * horizontalRatio;
    const initialY = (window.innerHeight - buttonSize) * verticalRatio;
    setPosition({ x: initialX, y: initialY });
  }, []);
  // Record the starting position when the mouse is pressed
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY }); // Save the position where the mouse was pressed
    setOffset({ x: position.x, y: position.y }); // Save the current button position

    setDragged(false); // Reset dragged flag
  };

  // Update the position as the mouse moves
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - startPosition.x;
      const deltaY = e.clientY - startPosition.y;

      // If the mouse moves more than the threshold, it's a dragging action
      if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
        setDragged(true); // Mark that drag has occurred

        const newX = offset.x + deltaX;
        const newY = offset.y + deltaY;

        // Prevent the button from exceeding the screen boundaries
        const clampedX = Math.min(
          Math.max(newX, padding), // No overflow on the left
          window.innerWidth - buttonSize - padding // No overflow on the right
        );
        const clampedY = Math.min(
          Math.max(newY, padding), // No overflow on the top
          window.innerHeight - buttonSize - padding // No overflow on the bottom
        );

        setPosition({ x: clampedX, y: clampedY });
      }
    }
  };
  const fetchGiteeToken = async () => {
    const storedToken = await getGiteeToken();
    if (storedToken) {
      setGiteeToken(storedToken);
    }
  };
  const fetchGithubToken = async () => {
    const storedToken = await getGithubToken();
    if (storedToken) {
      setGithubToken(storedToken);
    }
  };
  useEffect(() => {
    if (platform === 'Gitee') {
      fetchGiteeToken();
    } else {
      fetchGithubToken();
    }
  }, []);

  const handlePRSubmission = () => {
    setIsModalOpen(false); // Close modal after submission
    if (platform === 'Github') githubService.submitGithubPR(form, originalRepo, branch, filePath, fileContent);
    else giteeService.submitGiteePR(form, originalRepo, branch, filePath, fileContent);
  };
  const moveButtonToMouseUpPosition = (event: MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && selection.toString().trim() !== '') {
      const newX = event.clientX; //Horizontal position of mouse lift
      const newY = event.clientY; //Vertical position of mouse lift
      setPosition({
        x: Math.min(newX, window.innerWidth - buttonSize - padding),
        y: Math.min(newY, window.innerHeight - buttonSize - padding),
      });
    }
  };
  //Check if there is selected text
  const checkTextSelection = () => {
    const selection = window.getSelection();
    const hasSelection = Boolean(selection && selection.rangeCount > 0 && selection.toString().trim() !== '');
    setIsTextSelected(hasSelection);
    return hasSelection;
  };

  //Check if the text is selected when the mouse is raised
  useEffect(() => {
    const handleGlobalMouseUp = (event: MouseEvent) => {
      if (checkTextSelection()) {
        setIsTextSelected(true);
        moveButtonToMouseUpPosition(event);
      } else {
        setIsTextSelected(false);
      }
    };
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // Add state to track the currently selected text range
  const [selectedRange, setSelectedRange] = useState<Range | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && selection.toString().trim()) {
        const range = selection.getRangeAt(0);
        setSelectedRange(range);
        setIsTextSelected(true);

        // Get the position of selected text
        const rect = range.getBoundingClientRect();
        const x = Math.min(rect.right + 10, (window.innerWidth - buttonSize) * horizontalRatio);
        const y = rect.top + window.scrollY;
        setPosition({ x, y });
      } else {
        setSelectedRange(null);
        if (isTextSelected) {
          // If text was previously selected and now deselected, return to initial position
          const initialX = (window.innerWidth - buttonSize) * horizontalRatio;
          const initialY = (window.innerHeight - buttonSize) * verticalRatio;
          setPosition({ x: initialX, y: initialY });
          setIsTextSelected(false);
        }
      }
    };

    const handleScroll = () => {
      if (selectedRange && isTextSelected) {
        // If text is selected, update button position to follow the text
        const rect = selectedRange.getBoundingClientRect();

        // Check if selected text is within viewport
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          // Position button at the end of selected text, relative to viewport
          const x = Math.min(rect.right + 10, window.innerWidth - buttonSize - padding);
          const y = rect.top + rect.height / 2 - buttonSize / 2;
          setPosition({ x, y });
        } else {
          // If text is out of viewport, return to initial position
          const initialX = (window.innerWidth - buttonSize) * horizontalRatio;
          const initialY = (window.innerHeight - buttonSize) * verticalRatio;
          setPosition({ x: initialX, y: initialY });
        }
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [selectedRange, isTextSelected, horizontalRatio, verticalRatio]);

  // When the mouse is released, stop dragging, and determine if it's a click or drag
  const handleMouseUp = () => {
    if (!dragged) {
      // If no drag happened, consider it a click
      clickIcon();
    }
    setDragged(true);
    setIsDragging(false);
  };

  // Add mouse move and release event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, startPosition, offset, dragged]);
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);
  return (
    <>
      <FloatButton
        type="default"
        style={{
          left: position.x,
          top: position.y,
          position: 'fixed',
          height: buttonSize,
          width: buttonSize,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          cursor: isDragging ? 'grabbing' : 'pointer', // Change cursor style when dragging
        }}
        icon={<span className="float-btn-icon">{<FormOutlined />}</span>}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      <Modal
        title={<div style={{ textAlign: 'center', width: '100%' }}>{t('fast_pr')}</div>}
        open={isModalOpen}
        footer={null}
        closable={false}
      >
        <Form
          form={form}
          layout="vertical"
          name="pr_form"
          initialValues={{
            title: PR_TITLE(filePath),
            content: PR_CONTENT(filePath),
          }}
        >
          <Form.Item name="title" label={t('pr_title_label')} rules={[{ required: true, message: t('pr_title_rule') }]}>
            <Input placeholder={t('pr_title_placeholder')} />
          </Form.Item>
          <Form.Item
            name="content"
            label={t('pr_content_label')}
            rules={[{ required: true, message: t('pr_content_rule') }]}
          >
            <Input.TextArea placeholder={t('pr_content_placeholder')} rows={4} />
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button onClick={handleCancel} style={{ marginRight: '8px' }}>
            {t('pr_cancel')}
          </Button>
          <Button type="primary" onClick={handlePRSubmission}>
            {t('pr_submit')}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default View;
