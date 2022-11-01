import React, { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { AiFillGithub, AiOutlineLink, AiOutlinePlus } from 'react-icons/ai';
import classnames from 'classnames';

const AddSelectPopover: React.FC<{
  open: boolean;
  onClose: () => void;
  className?: string;
  onSelect: (v: 'input' | 'select') => void;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ className, onSelect, onClick, open, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, () => {
    onClose();
  });

  return (
    <div className={classnames('relative z-10 mt-4', className)}>
      <button
        type="button"
        className="flex items-center text-primary"
        onClick={(e) => onClick(e)}
      >
        <AiOutlinePlus /> Add repository
      </button>

      {open && (
        <div
          className="absolute top-8 left-0 w-[330px] border-2 border-black bg-white drop-shadow-xl"
          ref={ref}
        >
          <div
            className="flex cursor-pointer items-center py-4 pl-3 hover:bg-gray-100"
            onClick={() => {
              onSelect('select');
            }}
          >
            <AiFillGithub />
            <p className="ml-2 text-sm font-medium">
              Select from your own repository on GitHub
            </p>
          </div>
          <div
            className="flex cursor-pointer items-center px-3 py-4 hover:bg-gray-100"
            onClick={() => {
              onSelect('input');
            }}
          >
            <AiOutlineLink />
            <p className="ml-2 text-sm font-medium">
              Add from the GitHub repository url
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSelectPopover;
