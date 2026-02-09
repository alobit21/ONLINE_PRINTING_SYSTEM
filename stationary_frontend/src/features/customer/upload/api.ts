import { gql } from '@apollo/client';

export const CREATE_DOCUMENT = gql`
    mutation CreateDocument($fileName: String!, $fileSize: Int!, $fileType: String) {
        createDocument(fileName: $fileName, fileSize: $fileSize, fileType: $fileType) {
            response {
                status
                message
            }
            document {
                id
                fileName
                fileSize
                fileType
            }
        }
    }
`;
export interface CreateDocumentData {
    createDocument: {
        response: {
            status: boolean;
            message: string;
        };
        document: {
            id: string;
            fileName: string;
            fileSize: number;
            fileType: string;
        };
    };
}

export interface CreateDocumentVariables {
    fileName: string;
    fileSize: number;
    fileType?: string;
}
