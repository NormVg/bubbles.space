import asyncio
import os
import sys

from pipecat.frames.messages import EndFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.services.openai import OpenAILLMService
from pipecat.services.sarvam import SarvamSTTService, SarvamTTSService
from pipecat.transports.services.daily import DailyParams, DailyTransport

from dotenv import load_dotenv
load_dotenv()

async def main():
    if not os.getenv("DAILY_SAMPLE_ROOM_URL"):
        print("Please set DAILY_SAMPLE_ROOM_URL in .env")
        sys.exit(1)
        
    if not os.getenv("SARVAM_API_KEY"):
        print("Please set SARVAM_API_KEY in .env")
        sys.exit(1)
        
    if not os.getenv("OPENAI_API_KEY"):
        print("Please set OPENAI_API_KEY in .env")
        sys.exit(1)

    transport = DailyTransport(
        room_url=os.getenv("DAILY_SAMPLE_ROOM_URL"),
        token=os.getenv("DAILY_SAMPLE_ROOM_TOKEN") or "",
        bot_name="Sarvam AI Agent",
        params=DailyParams(
            audio_out_enabled=True,
            audio_in_enabled=True,
            vad_enabled=True,
            vad_analyzer=DailyTransport.create_default_vad_analyzer(),
            vad_audio_passthrough=True,
        ),
    )

    # Sarvam STT supports multiple Indian languages
    stt = SarvamSTTService(
        api_key=os.getenv("SARVAM_API_KEY"),
        language_code="hi-IN" # Hindi
    )

    # Sarvam TTS using the bulbul model
    tts = SarvamTTSService(
        api_key=os.getenv("SARVAM_API_KEY"),
        voice="bulbul:v3" # Adjust based on Sarvam docs
    )

    llm = OpenAILLMService(
        api_key=os.getenv("OPENAI_API_KEY"),
        model="gpt-4o"
    )

    # Simple prompt
    messages = [
        {
            "role": "system",
            "content": "You are a helpful AI assistant. Keep responses short and conversational. Please respond in Hindi."
        }
    ]

    pipeline = Pipeline(
        [
            transport.input(),
            stt,
            llm,
            tts,
            transport.output(),
            llm.create_context_aggregator(),
        ]
    )

    task = PipelineTask(
        pipeline,
        params=PipelineParams(
            allow_interruptions=True,
            enable_metrics=True,
        ),
    )

    # Initialize the LLM with the context
    @transport.event_handler("on_first_participant_joined")
    async def on_first_participant_joined(transport, participant):
        await task.queue_frame(llm.get_context_frame(messages))

    runner = PipelineRunner()
    print("Joining room...")
    await runner.run(task)

if __name__ == "__main__":
    asyncio.run(main())
