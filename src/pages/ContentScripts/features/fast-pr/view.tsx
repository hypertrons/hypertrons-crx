import React, { useState, useEffect } from 'react';
import { FormOutlined } from '@ant-design/icons';
import { FloatButton, Modal, Form, Input, Button } from 'antd';
import { getToken } from '../../../../helpers/github-token';
interface Props {
  filePath: string;
  repoName: string;
  branch: string;
}

const View = ({ filePath, repoName, branch }: Props) => {
  const fileUrl = `https://raw.githubusercontent.com/${repoName}/${branch}/${filePath}`;
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
  const dragThreshold = 5; // Threshold to distinguish dragging from clicking
  console.log(fileUrl);
  const GITHUB_TOKEN = getToken();
  // Click the icon
  const clickIcon = () => {
    const Stackedit = require('stackedit-js');
    const stackedit = new Stackedit();
    let originalContent = '';
    let content = '';

    fetch(fileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((data) => {
        document.body.style.overflow = 'hidden';
        originalContent = data;
        stackedit.openFile({ content: { text: originalContent } });
      })
      .catch((error) => {
        alert(`Fetch error: ${error.message}`);
      });

    stackedit.on('fileChange', (file: any) => {
      content = file.content.text;
      setFileContent(content);
    });

    // stackedit.on('close', () => {
    //   document.body.style.overflow = '';
    //   if (originalContent.charCodeAt(originalContent.length - 1) === 10) {
    //     content += String.fromCharCode(10);
    //   }
    //   if (originalContent != content) {
    //     // If content has changed, handle PR creation
    //     setIsModalOpen(true);
    //   }
    // });
  };

  const submitPR = async () => {
    // Here, you'd include logic to create a pull request, using GitHub API or any method
    form
      .validateFields()
      .then((values) => {
        console.log('Received values from form: ', values);
        // You can now use 'values.title' and 'values.content' to submit your PR
        console.log('PR submitted with title: ', values.title);
        console.log('PR submitted with content: ', values.content);
        // createPullRequest(values.title,values.content);

        // createBranchIfNotExists(
        //   values.title,
        //   values.content,
        //   new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')
        // );
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  // Modal cancel handler
  const handleCancel = () => {
    setIsModalOpen(false); // Close modal without action
    form.resetFields();
  };

  // Set the initial position to the middle-right of the screen when the component loads
  useEffect(() => {
    const initialX = window.innerWidth - buttonSize - padding; // 24px from the right of the screen
    const initialY = window.innerHeight / 2 - buttonSize / 2; // Center vertically
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

  // When the mouse is released, stop dragging, and determine if it's a click or drag
  const handleMouseUp = () => {
    if (!dragged) {
      console.log(dragged);
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
      <Modal title="Content Modified" open={isModalOpen} footer={null} closable={false}>
        <Form form={form} layout="vertical" name="pr_form">
          <Form.Item name="title" label="PR Title" rules={[{ required: true, message: 'Please enter the PR title' }]}>
            <Input placeholder="Enter PR title" />
          </Form.Item>
          <Form.Item
            name="content"
            label="PR Content"
            rules={[{ required: true, message: 'Please enter the PR content' }]}
          >
            <Input.TextArea placeholder="Enter PR content" rows={4} />
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button onClick={handleCancel} style={{ marginRight: '8px' }}>
            Cancel
          </Button>
          <Button type="primary" onClick={submitPR}>
            Submit PR
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default View;
