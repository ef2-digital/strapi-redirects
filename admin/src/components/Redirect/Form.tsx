import React, { useState } from "react";
import pluginId from "../../pluginId";
import { Plus } from "@strapi/icons";

import {
  Box,
  Flex,
  Field,
  FieldLabel,
  FieldInput,
  Typography,
  LinkButton,
} from "@strapi/design-system";
import { RedirectContext } from "../../hooks/useRedirect";
import redirectRequest from "../../api/redirect";
import { Types } from "../../hooks/redirectReducer";

const Form = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sourceError, setSourceError] = useState(false);
  const [destinationError, setDestinationError] = useState(false);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const { dispatch } = React.useContext(RedirectContext);

  const upsertRedirect = () => {
    const hasSourceError = !source;
    const hasDestinationError = !destination;

    setSourceError(hasSourceError);
    setDestinationError(hasDestinationError);

    if (hasSourceError || hasDestinationError) {
      return;
    }

    setLoading(true);

    redirectRequest
      .upsert(undefined, { source, destination })
      .then((response) => {
        setLoading(false);

        if (response.error) {
          setError(response.error);

          return;
        }

        dispatch({
          type: Types.Set,
          payload: {
            redirects: response.data,
          },
        });

        setSource("");
        setDestination("");
      });
  };

  return (
    <>
      <Box>
        <Flex gap={4}>
          <Field
            name="source"
            required={true}
            width="50%"
            error={sourceError || error}
          >
            <Box width="100%">
              <FieldLabel>Source</FieldLabel>
              <FieldInput
                type="text"
                placeholder="/"
                value={source}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSourceError(false);
                  setSource(e.target.value);
                }}
              />
            </Box>
          </Field>

          <Field
            name="destination"
            required={true}
            width="50%"
            error={destinationError || error}
          >
            <Box width="100%">
              <FieldLabel>Destination</FieldLabel>
              <FieldInput
                type="text"
                placeholder="/"
                value={destination}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setDestinationError(false);
                  setDestination(e.target.value);
                }}
              />
            </Box>
          </Field>
        </Flex>
        <Typography textColor="danger600">{error}</Typography>
        <Box paddingTop={5}>
          <LinkButton
            startIcon={<Plus />}
            onClick={upsertRedirect}
            disabled={loading}
          >
            Add
          </LinkButton>
        </Box>
      </Box>
    </>
  );
};

export default Form;
