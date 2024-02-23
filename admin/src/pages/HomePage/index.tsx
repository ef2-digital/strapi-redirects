/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from "react";
import { Trash, Rocket } from "@strapi/icons";

import {
  Alert,
  BaseHeaderLayout,
  Button,
  Box,
  Divider,
  Flex,
  IconButton,
  Typography,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  VisuallyHidden,
} from "@strapi/design-system";
import { RedirectContext } from "../../hooks/useRedirect";
import redirectRequest from "../../api/redirect";
import { Types } from "../../hooks/redirectReducer";
import Form from "../../components/Redirect/Form";

enum DeployStatus {
  READY = "READY",
  ERROR = "ERROR",
  BUILDING = "BUILDING",
  DEPLOYING = "DEPLOYING",
  UPLOADING = "UPLOADING",
  CANCELLED = "CANCELLED",
  QUEUED = "QUEUED",
  CANCELING = "CANCELING",
  BUILDING_AND_DEPLOYING = "BUILDING_AND_DEPLOYING",
}

const HomePage = () => {
  const { dispatch, state } = React.useContext(RedirectContext);
  const [loading, toggleLoading] = useState(false);
  const [success, toggleSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    redirectRequest.get().then((response) => {
      dispatch({
        type: Types.Set,
        payload: {
          redirects: response.data,
        },
      });
    });
  }, []);

  const onDelete = async (id: number) => {
    await redirectRequest.delete(id).then((response) => {
      dispatch({
        type: Types.Set,
        payload: {
          redirects: response.data,
        },
      });
    });
  };

  useEffect(() => {
    if (!success) {
      return;
    }

    setTimeout(() => {
      toggleSuccess(false);
    }, 5000);
  }, [success]);

  useEffect(() => {
    if (error === "") {
      return;
    }

    setTimeout(() => {
      setError("");
    }, 5000);
  }, [error]);

  const deploy = async () => {
    toggleLoading(true);
    const isDeployable = await redirectRequest.checkDeploy(Date.now());

    if (isDeployable.status === DeployStatus.BUILDING || isDeployable.error) {
      setError(isDeployable.error.message);
      toggleLoading(false);

      return false;
    }

    await redirectRequest.trigger().then((response) => {
      toggleLoading(false);
      toggleSuccess(true);
      return response;
    });
  };

  return (
    <>
      {success && (
        <Alert closeLabel="Close" title="Deploy successfull" variant="success">
          Your redirects have been deployed successfully
        </Alert>
      )}

      {error && (
        <Alert closeLabel="Close" title="Error" variant="danger">
          {error}
        </Alert>
      )}

      <Box background="neutral100">
        <BaseHeaderLayout
          primaryAction={
            <Button
              startIcon={<Rocket />}
              variant="default"
              onClick={() => deploy()}
              loading={loading}
            >
              Deploy
            </Button>
          }
          title="Redirects"
          subtitle={`${state.redirects ? state.redirects.length : 0} redirects`}
          as="h2"
        />
      </Box>
      <Box paddingLeft={10} paddingRight={8} paddingBottom={8} width="75%">
        <Box hasRadius background="neutral0" shadow="tableShadow" padding={4}>
          <Typography variant="omega" as="h3" fontWeight="semiBold">
            Add redirect
          </Typography>
          <Box paddingTop={2} paddingBottom={2}>
            <Divider />
          </Box>
          <Form />
        </Box>
      </Box>
      <Box
        paddingLeft={10}
        paddingRight={8}
        paddingBottom={10}
        background="neutral100"
        width="75%"
      >
        <Table>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma">Source</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Destination</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Date added:</Typography>
              </Th>
              <Th width="10">
                <VisuallyHidden>Actions</VisuallyHidden>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {state.redirects.map((redirect) => (
              <Tr>
                <Td>
                  <Typography variant="omega">
                    {redirect.attributes?.source}
                  </Typography>
                </Td>
                <Td>
                  <Typography variant="omega">
                    {redirect.attributes?.destination}
                  </Typography>
                </Td>
                <Td>
                  <Typography variant="omega">
                    {redirect.attributes?.createdAt}
                  </Typography>
                </Td>
                <Td>
                  <Flex>
                    <Box paddingLeft={1}>
                      <IconButton
                        onClick={() => onDelete(redirect.id)}
                        label="Delete"
                        noBorder
                        icon={<Trash />}
                      />
                    </Box>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export default HomePage;
