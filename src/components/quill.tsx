'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{ align: [] }],
    ['image', 'link'],
  ],
};

const Quill: React.FC<Props> = ({ value, onChange, onFocus, onBlur }) => {
  return (
    <div className="mt-2 rounded-lg">
      <ReactQuill
        value={value}
        modules={modules}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
};

export default Quill;
