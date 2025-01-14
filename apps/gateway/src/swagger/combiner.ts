import axios from 'axios';
import { OpenAPIObject } from '@nestjs/swagger';
import {
  SecuritySchemeObject,
  ReferenceObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

interface SwaggerDoc extends OpenAPIObject {
  paths: Record<string, any>;
  components?: {
    schemas?: Record<string, any>;
    securitySchemes?: Record<string, SecuritySchemeObject | ReferenceObject>;
  };
}

const fetchAndModifySwagger = async (
  url: string,
  prefix: string,
): Promise<SwaggerDoc | null> => {
  try {
    const response = await axios.get(url);
    const swaggerDoc = response.data;

    const modifiedPaths = {};
    Object.entries(swaggerDoc.paths || {}).forEach(([path, definition]) => {
      const newPath = `${prefix}${path === '/' ? '' : path}`;
      modifiedPaths[newPath] = definition;
    });

    return {
      openapi: '3.0.0',
      ...swaggerDoc,
      paths: modifiedPaths,
    };
  } catch (error) {
    console.error(`Failed to fetch swagger from ${url}:`, error.message);
    return null;
  }
};

export const createCombinedSwagger = async (): Promise<OpenAPIObject> => {
  try {
    const [usersSwagger, communitiesSwagger] = await Promise.all([
      fetchAndModifySwagger(
        'http://solidarianid-users:3002/api-json',
        '/users',
      ),
      fetchAndModifySwagger(
        'http://solidarianid-communities:3001/api-json',
        '/communities',
      ),
    ]);

    const combinedSpec: OpenAPIObject = {
      openapi: '3.0.0',
      info: {
        title: 'SolidarianID API',
        version: '1.0.0',
      },
      paths: {
        ...usersSwagger?.paths,
        ...communitiesSwagger?.paths,
      },
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'accessToken',
          } as SecuritySchemeObject,
        },
        schemas: {
          ...usersSwagger?.components?.schemas,
          ...communitiesSwagger?.components?.schemas,
        },
      },
    };

    return combinedSpec;
  } catch (error) {
    console.error('Failed to combine swagger specs:', error);
    throw error;
  }
};
