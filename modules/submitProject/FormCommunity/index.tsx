import React, { useRef, useState } from 'react';
import { useCreateProjectTaskMutation } from '@graphql/generated';
import client from '@graphql/client';
import uniq from 'lodash/uniq';
import { useSessionStorage } from 'react-use';
import Select from '@modules/submitProject/Form/Select';
import Button from '@modules/submitProject/Form/Button';
import SwitchToSingleRepo from './SwitchToSingleRepo';
import SoftwareArtifactRepository from './SoftwareArtifactRepository';
import GovernanceRepository from './GovernanceRepository';
import { fillHttps, repoUrlFormat } from '@common/utils';
import { useSession } from 'next-auth/react';
import Message from '@modules/submitProject/Misc/Message';

const FormCommunity = () => {
  const { data: session } = useSession();
  const [communityName, setCommunityName] = useState('');
  const [sarUrls, setSarUrls] = useSessionStorage<string[]>(
    'software_artifact_repository',
    []
  );
  const [grUrls, setGrUrls] = useSessionStorage<string[]>(
    'governance_repository',
    []
  );

  const options = uniq([...sarUrls, ...grUrls].map((v) => repoUrlFormat(v)));
  const { isLoading, isError, mutate, data } = useCreateProjectTaskMutation(
    client,
    {
      onSuccess() {
        setCommunityName('');
        setSarUrls([]);
        setGrUrls([]);
      },
    }
  );

  const createStatus = data?.createProjectTask?.status;
  const createMessage = data?.createProjectTask?.message || '';
  const createUrl = data?.createProjectTask?.prUrl;

  const handleSubmit = () => {
    const common = {
      username: session!.user!.login as string,
      token: session!.accessToken as string,
      origin: session!.provider as string,
    };
    const projectName = communityName || options[0];
    mutate({
      ...common,
      projectName,
      projectTypes: [
        { type: 'software-artifact-repositories', repoList: sarUrls },
        { type: 'governance-repositories', repoList: grUrls },
      ],
    });
  };

  return (
    <div className="flex w-full md:flex-col md:px-6">
      <div className="flex-1">
        <h3 className="mb-6 text-[28px] font-medium">Community</h3>

        <SoftwareArtifactRepository
          value={sarUrls}
          onChange={(v) => {
            const val = v.map(fillHttps);
            setSarUrls(uniq(val));
          }}
        />

        <GovernanceRepository
          value={grUrls}
          onChange={(v) => {
            const val = v.map(fillHttps);
            setGrUrls(uniq(val));
          }}
        />

        {options.length > 0 && (
          <div className="max-w-[500px]">
            <label className="mt-10 mb-4 block text-xl font-medium">
              Community Name
            </label>
            <Select
              className="w-full"
              value={communityName}
              onChange={(e) => {
                setCommunityName(e);
              }}
            >
              {options.map((option) => {
                return (
                  <option key={option} value={option}>
                    {option}
                  </option>
                );
              })}
            </Select>
          </div>
        )}

        <Button
          loading={isLoading}
          className="mt-10 min-w-[130px]"
          disabled={sarUrls.length === 0}
          onClick={() => handleSubmit()}
        >
          Submit
        </Button>

        <Message
          show={Boolean(data)}
          isError={isError}
          message={createMessage}
          status={createStatus}
          url={createUrl}
        />
      </div>

      <SwitchToSingleRepo />
    </div>
  );
};

export default FormCommunity;
