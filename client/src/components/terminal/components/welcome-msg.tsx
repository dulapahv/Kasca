import Image from 'next/image';

import { SITE_NAME } from '@/lib/constants';

const WelcomeMsg = () => {
  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center gap-2 text-green-500">
        <Image
          src="/images/kasca-logo.svg"
          alt="Kasca Logo"
          className="size-5"
          width="16"
          height="16"
          priority
        />
        <span>Welcome to {SITE_NAME}</span>
      </div>
      <div className="text-green-500">---------------------------------</div>
      <div>
        This is a shared terminal. All participants can view the output here.
        {'\n'}
        {'\n'}
        Type your code in the editor and click run.
        {'\n'}
        Select language via the dropdown in the bottom right corner.
      </div>
    </div>
  );
};

export { WelcomeMsg };
