import request from '../../src/helpers/request';

describe('request helper', () => {
  it('returns parsed JSON when response is ok', async () => {
    const payload = { ok: true, data: [1, 2, 3] };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(payload),
      })
    );

    await expect(request('https://example.com')).resolves.toEqual(payload);
  });

  it('throws status code when response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    );

    await expect(request('https://example.com')).rejects.toBe(500);
  });
});
