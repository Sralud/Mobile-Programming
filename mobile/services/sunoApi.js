const SUNO_API_KEY = 'adf674a7984fa01559e9329586fe0292';
const SUNO_BASE_URL = 'https://api.sunoapi.org';

/**
 * Generate music using Suno AI API
 * @param {string} prompt - Description of the song to generate
 * @param {string} genre - Optional genre specification
 * @returns {Promise<Object>} - Generated song data
 */
export const generateMusic = async (prompt, genre = '') => {
    try {
        // Combine prompt with genre if provided
        const fullPrompt = genre ? `${prompt} (Genre: ${genre})` : prompt;

        // Using Non-custom Mode (customMode: false) for simplicity
        // Only prompt is required, lyrics will be auto-generated
        const payload = {
            customMode: false,
            prompt: fullPrompt,
            instrumental: false,
            model: 'V4_5',  // V4.5 model for better quality
            callBackUrl: 'https://example.com/callback'  // Required but we use polling instead
        };

        console.log('Sending request to Suno API:', payload);

        const response = await fetch(`${SUNO_BASE_URL}/api/v1/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUNO_API_KEY}`,
            },
            body: JSON.stringify(payload),
        });

        console.log('Response status:', response.status);

        const responseText = await response.text();
        console.log('Response body:', responseText);

        if (!response.ok) {
            let errorMessage = 'Failed to generate music';
            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.msg || errorData.message || errorData.error || errorData.detail || errorMessage;
                console.error('API Error Details:', errorData);
            } catch (e) {
                errorMessage = `API Error (${response.status}): ${responseText}`;
            }
            throw new Error(errorMessage);
        }

        const data = JSON.parse(responseText);
        console.log('Success response:', data);

        // API returns {code: 200, msg: "success", data: {taskId: "..."}}
        if (data.code !== 200 || !data.data || !data.data.taskId) {
            throw new Error('Invalid API response structure');
        }

        return data;
    } catch (error) {
        console.error('Suno API Error:', error);
        throw error;
    }
};

/**
 * Get the status of a music generation task
 * @param {string} taskId - Task ID to check
 * @returns {Promise<Object>} - Task status data
 */
export const getTaskStatus = async (taskId) => {
    try {
        console.log('Querying task status for ID:', taskId);

        const response = await fetch(`${SUNO_BASE_URL}/api/v1/generate/record-info?taskId=${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${SUNO_API_KEY}`,
            },
        });

        console.log('Query response status:', response.status);

        const responseText = await response.text();
        console.log('Query response body:', responseText);

        if (!response.ok) {
            let errorMessage = 'Failed to fetch task status';
            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.msg || errorData.message || errorData.error || errorMessage;
            } catch (e) {
                errorMessage = `API Error (${response.status}): ${responseText}`;
            }
            throw new Error(errorMessage);
        }

        const data = JSON.parse(responseText);
        console.log('Query success response:', data);
        return data;
    } catch (error) {
        console.error('Suno API Query Error:', error);
        throw error;
    }
};

/**
 * Poll for task completion
 * @param {string} taskId - Task ID to monitor
 * @param {number} maxAttempts - Maximum number of polling attempts
 * @param {number} interval - Polling interval in milliseconds
 * @returns {Promise<Object>} - Completed task data
 */
export const pollTaskCompletion = async (taskId, maxAttempts = 60, interval = 3000) => {
    console.log('Starting to poll for task completion...');

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        console.log(`Polling attempt ${attempt + 1}/${maxAttempts}`);

        const statusData = await getTaskStatus(taskId);

        // Check task status
        // Response structure: {code: 200, msg: "success", data: {status: "SUCCESS"|"PROCESSING"|"FAILED", response: {sunoData: [...]}}}
        if (statusData.code === 200 && statusData.data) {
            const status = statusData.data.status;
            console.log(`Task status: ${status}`);

            if (status === 'SUCCESS') {
                console.log('Task completed successfully!');
                return statusData;
            } else if (status === 'FAILED') {
                const errorMsg = statusData.data.errorMessage || 'Task failed';
                throw new Error(errorMsg);
            }
            // If PROCESSING, continue polling
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error('Task generation timed out');
};
