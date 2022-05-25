import { ReactNode } from 'react';
import cx from 'classnames';

import './styles.scss';

type messageProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function message({
  content,
  author,
  isAnswered = false,
  isHighlighted = false,
  children,
}: messageProps) {
  return (
    <div 
      className={cx(
        'message', 
        { answered: isAnswered },
        { highlighted: isHighlighted && !isAnswered },
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  );
}